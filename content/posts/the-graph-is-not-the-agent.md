---
title: "The Graph Isn't the Agent"
date: 2026-07-01
draft: false
description: "Why wiring a LangGraph tool loop doesn't make an agent smart, why it trips over its own complexity, and what a proper agent harness (and Accountant24) get right instead."
image: "images/projects/agent-orchestration/hero.svg"
tags: ["AI", "Agentic AI", "LangGraph", "Agents", "Engineering"]
---

Somewhere in every big org right now, there is a Slack channel called `#ai-agents-initiative`, and someone in it has just shipped a LangGraph demo that calls a weather API. Leadership is thrilled. A slide says "Agentic AI" in a font that's a little too big. I've been that someone. I've built that demo. I've also watched it fall over the moment a real user typed something slightly weird into it.

This is the part nobody puts in the slide: **an agent loop and an intelligent agent are not the same thing**, and the gap between them is where most of these projects quietly die.

## The LangGraph Seduction

Here's the pitch that gets everyone, including me, the first time: an agent is just a loop. Call the model, let it pick a tool, run the tool, feed the result back, repeat until done. LangGraph makes this genuinely easy to draw:

```python
from langgraph.graph import StateGraph, END

def call_model(state):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

def call_tool(state):
    last = state["messages"][-1]
    result = tools[last.tool_calls[0]["name"]].invoke(last.tool_calls[0]["args"])
    return {"messages": [result]}

graph = StateGraph(AgentState)
graph.add_node("agent", call_model)
graph.add_node("tool", call_tool)
graph.add_conditional_edges("agent", should_continue, {"continue": "tool", "end": END})
graph.add_edge("tool", "agent")
```

Twenty lines, and it *works*. It calls a tool, reads the output, decides what's next. For a demo query, it looks indistinguishable from intelligence. That's the trap — it's not that this code is wrong, it's that this is the easy 20%, and everyone mistakes it for the whole agent.

## Where It Trips Over Its Own Feet

Ship that loop past a demo and into a real workflow, and the cracks show up fast, and they're always the same cracks:

- **The context window becomes a landfill.** Every tool call, every observation, every retry gets appended to `messages` and never leaves. By turn eight, the model is reasoning with 40% signal and 60% stale tool output it should have forgotten three steps ago.
- **The graph has no idea it's confused.** A conditional edge routes on some string match or a `should_continue` heuristic — it has no concept of "we've tried this twice, stop." So it tries a third time. And a fourth.
- **One flat state means one blast radius.** A tool call, a sub-question, a "let me just double check something" detour — all of it lives in the same `messages` list as the main task. There's no notion of a scoped, disposable sub-conversation.
- **Every tool is equally trusted.** `read_file` and `run_shell_command` sit in the same `tools` dict with the same permission level, because the graph has no concept of permissions at all — that was never LangGraph's job to begin with.
- **Nobody is tracking the actual goal.** The state graph tracks *messages*, not *intent*. Ask it to do five things and it'll happily lose two of them in the transcript.

None of this is a LangGraph bug. LangGraph is a graph execution library — it does exactly what you wired it to do. The problem is that "wire a loop" and "build an agent" got treated as the same sentence.

![A naive ReAct loop three turns in — the context window filling up, no compaction, every tool equally trusted](/images/projects/agent-orchestration/react-loop.svg)

## So What's an Agent Harness, Actually?

This is the part that took me embarrassingly long to get: **the loop was never the hard part.** The hard part is everything wrapped around the loop — and that wrapper has a name now: a harness. Think of Claude Code, or the minimal `pi` agent harness I'll get to in a second. None of them reinvent "call model, run tool." What they add is infrastructure the naive loop never had:

![Five things a harness gives the loop that a bare graph never does](/images/projects/agent-orchestration/harness-layers.svg)

A harness treats an agent less like a chatbot with function-calling bolted on, and more like an *operator* dropped into a real environment — a shell, a filesystem, a git repo — with guardrails. It plans before it acts and keeps a todo list instead of trusting the model to remember five sub-goals across a thousand tokens. It actively compacts its own context instead of hoarding every tool result forever. It spins up sub-agents for messy, exploratory work so the main thread doesn't get polluted by twelve failed research attempts. It treats permissions as a first-class concept, not an afterthought — reading a file and rewriting your `.bashrc` are not the same risk category. And critically, it doesn't store memory in the conversation at all — it stores it in files, in git commits, in things that survive after the chat window is long gone.

## The Actual Difference

Here's the thing that reframed it for me: **the difference isn't LangGraph vs. no LangGraph.** You could build a perfectly good harness with LangGraph's primitives, or a terrible one without it. The real split is where you think the complexity of "being an agent" lives.

The naive approach treats orchestration as *glue code* — a means to connect a model to some tools, thin and disposable, something you write once per project and never think about again. The harness approach treats orchestration as *infrastructure* — a durable, reusable layer that handles context, permissions, memory, and self-correction so consistently well that you stop noticing it's there, the same way you stop noticing your OS's process scheduler. One of these gets rebuilt, badly, in every new agent project. The other gets built once, well, and reused.

That's really the whole insight. Smart-seeming behavior wasn't a property of a bigger model or a cleverer prompt. It was a property of *not letting the plumbing fail silently*.

## A Real Example: Accountant24

Theory is cheap, so here's a project that makes the point concrete. [Accountant24](https://accountant24.ai/) ([GitHub](https://github.com/machulav/accountant24)) is a local-first AI agent for personal finance, built by developer Andrii Machula. You talk to it in plain language — "spent ₹450 on chai and samosas at the office canteen" — and it logs the transaction, understands your categories, and answers questions about your spending. Nothing unusual so far; half of AI Twitter has shipped a finance-agent demo this year.

What's interesting is what it's built *on*: [pi](https://pi.dev/), described by its author, Mario Zechner, as "a minimal but powerful framework for building AI agents" — an agent harness, not a graph library. And Accountant24 leans on exactly the harness properties above instead of reinventing them:

- **Durable state, not chat memory.** Every ledger entry is a plain-text file, and every change is auto-committed to a local git repo. Your financial history isn't trapped in a conversation log — it's `git log`-able, diffable, revertable.
- **A real accounting engine underneath**, [hledger](https://hledger.org/), doing actual double-entry bookkeeping — the harness didn't need to reinvent arithmetic, it just needed to call a tool that already gets accounting right.
- **Memory that sticks.** Tell it a rule once — "categorize Swiggy orders as Food" — and it applies that rule going forward, because the harness has a real place to persist learned behavior, not just a longer prompt.
- **Model-agnostic by design**, including fully local models via Ollama, because the harness's job is the loop and the guardrails, not locking you to one vendor's function-calling format.

Notice what the *project author* never had to build: a context-compaction strategy, a memory system, a retry policy, a permission model for "this agent can write files but let's not let it `rm -rf` your ledger." All of that came free from the harness. What they built instead was the actual domain value — accounting logic, ledger integration, the specific conversational shape of "how does a person actually talk about their money." That's the leverage a harness buys you: it absorbs the 80% of an agent that is *always the same hard problem*, so you get to spend your time on the 20% that's actually your product.

## Where This Goes Next

None of this makes LangGraph bad — it's a perfectly good tool for wiring a graph. It just isn't, by itself, an agent harness, and conflating the two is why so many "agentic" pilots stall out somewhere between the demo and the second week of real usage.

Getting the orchestration right is step one. It's also the easy step to reason about, because it's mostly an engineering problem — context, state, retries, memory. The harder conversation starts once the agent actually works and can *do things*: what should it be allowed to touch, what should require a human in the loop, and what happens when it's confidently wrong. That's what we'll get into next — agent policies and safety.

---

*Sources: [Accountant24 project site](https://accountant24.ai/), [machulav/accountant24 on GitHub](https://github.com/machulav/accountant24), [pi — earendil-works/pi](https://github.com/earendil-works/pi), [pi.dev](https://pi.dev/).*
