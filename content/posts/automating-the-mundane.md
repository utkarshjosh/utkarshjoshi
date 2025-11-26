---
title: "Automating the Mundane: How I Built a Full-Stack Attendance Bot"
date: 2025-11-26
draft: false
tags: ["Automation", "NodeJS", "Flutter", "Puppeteer", "Firebase", "Engineering"]
image: "images/projects/automation-hero-image.png"
---

Every developer has that one daily task they secretly despise. For me, it wasn't writing docs or fixing bugs—it was the daily "swipe-in" on our HR portal, let's call it "Gx-HR" (you know the one).

Here is the irony: I physically go to the office every single day. I am there. But remembering to open the app and click "Sign In" at 10:00 AM? That is a mental load I simply couldn't carry.

The result? I constantly had to beg my manager—who also happens to be the CEO—to "regularize" my attendance. "Hey, I was here, I promise. Please mark me present." It was embarrassing. It was inefficient.

I have a history of automating things I don’t like. Previously, I scraped data from Cricbuzz by bypassing the HTML parsing entirely and hooking into their server-side event JSONs to push data to my webhook. It was clean, fast, and satisfying.

Naturally, I decided it was time to give "Gx-HR" the same treatment.

> **Disclaimer:** This project was built strictly for educational purposes to explore browser automation and real-time architecture. Always respect the Terms of Service of the platforms you use.

## Phase 1: The "Hacker" Approach (And Why It Failed)

My initial plan was standard: Reverse-engineer the API.

I fired up the network tab, ready to capture the login request, copy the headers, and replay it with a simple curl script or Node fetch. I expected a standard JWT token flow.

Gx-HR had other plans.

They use a complex JWKS (JSON Web Key Set) based sign-in flow. The authentication tokens were signed and encrypted in a way that made mimicking the API calls incredibly difficult without a deep dive into their specific OAuth/OIDC implementation. I spent hours trying to crack the token generation, but I was hitting a wall.

I realized I was over-engineering the auth and under-engineering the solution.

## Phase 2: The Pivot to Puppeteer

If I couldn't speak the API's language, I decided to just mimic the user. Enter Puppeteer.

Puppeteer allows you to spin up a headless Chrome instance that interacts with a website just like a human does. It doesn't care about JWKS encryption; it just cares about CSS selectors.

I built a lightweight Node.js server using Express with a straightforward logic flow:

1.  Launch Headless Chrome.
2.  Navigate to the Gx-HR login page.
3.  Type credentials and handle the "Work Location" modal (Office vs. WFH).
4.  Click "Sign In".

I used node-cron to schedule this to run automatically. But I ran into a new problem: How do I control this without SSH-ing into my server every time I work from home?

## Phase 3: The "Overkill" Control Center (Flutter + Firebase)

I didn't just want a script; I wanted a product. I built a mobile companion app using Flutter to act as my command center.

The app allows me to:

*   **View Status:** See if today's swipe was Pending, Successful, or Failed.
*   **Toggle Work Location:** Switch between "Office" and "Work From Home" config.
*   **Manual Trigger:** A big button to run the script immediately if I wake up late.
*   **Logs:** View a history of automation runs.

### The "Magic": Real-Time Sync without Sockets

The coolest part of this stack is how the Mobile App talks to the Node Server. I didn't want to write complex WebSocket code. Instead, I used Firebase Firestore as the nervous system.

I utilized a Push Model over traditional polling:

1.  **The Trigger:** I change my schedule in the Flutter app (e.g., from 10:00 AM to 10:30 AM). This updates a document in Firestore.
2.  **The Listener:** My Node.js server has an active `onSnapshot` listener on that document.
3.  **The Action:** Firestore pushes the change to the server in milliseconds. The server detects the change, destroys the old cron job, and spins up a new one instantly.

### Supported Configurations

The system handles several dynamic configurations via Firestore:

*   `config/schedule`: Controls the Cron expression (e.g., `0 10 * * 1-5` for every weekday at 10 AM).
*   `config/location`: Handles Lat/Long coordinates (for geo-fenced attendance) and GPS accuracy.
*   `config/work_location`: Toggles the specific modal logic for "Office" vs "WFH" inside the Gx-HR portal.

## Conclusion

What started as an attempt to avoid awkward conversations with my CEO turned into a robust full-stack architecture. By combining the raw automation power of Puppeteer, the real-time capabilities of Firebase, and the UI flexibility of Flutter, I built a system that solves a genuine pain point.

Now, the bot handles the boring stuff, and I can focus on actual work (and never missing a swipe-in again).
