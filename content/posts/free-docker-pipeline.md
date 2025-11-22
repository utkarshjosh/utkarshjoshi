---
title: "Building a Zero-Cost CI/CD Pipeline"
date: 2025-11-22
draft: false
tags: ["DevOps", "AWS", "Docker", "GitHub Actions", "Cloudflare"]
---

I recently built a [Real-Time Quiz App]({{< ref "projects/real-time-quiz-app" >}}) (check it out live at [quiz.utkarshjoshi.com](https://quiz.utkarshjoshi.com)), and while the coding part was fun, the deployment was a whole other beast. I wanted a professional-grade CI/CD pipeline, but I had one strict constraint: **it had to be 100% free.**

This is the story of how I hacked together AWS Free Tier, Namecheap, Cloudflare, and GitHub Actions to build a robust deployment pipeline without spending a dime.

## The Backstory: A Free Tier Dream

It started with a fresh AWS Free Tier account. I knew I wanted to deploy my Go and React application on an EC2 instance, but I didn't want to manually SSH in and `git pull` every time I made a change. That’s not how modern software is built. I wanted the "push-to-deploy" magic, but I didn't want to pay for Heroku or Vercel's pro features.

## Step 1: Identity and Access (Namecheap & Cloudflare)

First, I needed an identity. I purchased my domain from **Namecheap**. It's affordable and reliable. But I didn't stop there.

To handle DNS and get that sweet, sweet free SSL and DDoS protection, I pointed the nameservers to **Cloudflare**. Setting up the proxy in Cloudflare was crucial. It masks my EC2 IP address and handles HTTPS termination for me, so I didn't have to mess around with Certbot on the server immediately. It was a simple change that added a layer of professional polish and security instantly.

## The Challenge: A Simple CI Pipeline

My goal for the [Quiz App](https://quiz.utkarshjoshi.com) was simple:
1.  Push code to GitHub.
2.  GitHub Actions builds the Docker image.
3.  The new version automatically deploys to my EC2 instance.
4.  **Cost: $0.**

But doing this securely and for free is trickier than it sounds. I ran into issues with SSM not executing commands, confusion over ECR free tier limits, and the classic "it works on my machine" Docker networking problems.

## How I Did It (And How You Can Too)

If you want to replicate this setup, here is the recipe:

### 1. The Compute (AWS EC2)
I spun up a `t2.micro` instance on AWS. It's free for the first year and perfect for hosting lightweight Docker containers.

### 2. The Security (No SSH Keys!)
Instead of managing SSH keys (which can be leaked), I used **AWS Systems Manager (SSM)**. This allows GitHub Actions to send commands to my EC2 instance securely without ever opening port 22 to the world. It feels like magic and is much more secure.

### 3. The Pipeline (GitHub Actions)
I wrote a GitHub Actions workflow that:
*   **Builds** the Docker image from my repository.
*   **Pushes** it to a container registry (I used Docker Hub to save on ECR storage limits).
*   **Authenticates** via AWS OIDC (no long-lived AWS access keys stored in secrets!).
*   **Deploys** by triggering a shell script on the EC2 instance via SSM to pull the new image and restart the containers.

## The Result

Now, whenever I push to `main`, my [Quiz App](https://quiz.utkarshjoshi.com) updates automatically. It’s a fully automated, professional pipeline running on a student budget.

If you're a developer looking to level up your DevOps skills, stop paying for managed services and try building this yourself. It’s the best way to learn, and the satisfaction of watching that green checkmark on GitHub Actions is worth every second of troubleshooting.