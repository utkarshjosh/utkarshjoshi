---
title: "Building a Real-Time Quiz App: A Full-Stack Journey"
date: 2025-11-22
draft: false
description: "How I built a high-performance real-time quiz platform using Go, React, and WebSockets."
image: "images/projects/quiz-app-hero.png"
tags: ["React", "Go", "WebSockets", "PostgreSQL", "System Design"]
---

![Quiz App Gameplay](/images/projects/quiz-app-gameplay.png)

A high-energy, real-time quiz application designed for live competitions. This full-stack project enables users to create quizzes, host game sessions, and compete with friends in real-time, featuring instant scoring and dynamic leaderboards.

## Key Features

- **Live Multiplayer Sessions**: Join games instantly using a unique 6-digit PIN.
- **Real-Time Interaction**: WebSocket-powered communication for sub-second latency.
- **Dynamic Scoring**: Points awarded based on speed and accuracy, with streak bonuses.
- **Host Controls**: comprehensive dashboard for managing players and game flow.
- **Responsive Design**: Seamless experience across desktop and mobile devices.

## Architecture

The system is built on a microservices-inspired architecture to ensure scalability and performance:

![Quiz App Architecture](/images/projects/quiz-app-architecture.png)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Node.js API    │    │  PostgreSQL     │
│   (Frontend)    │◄──►│   (Express)     │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Go WebSocket   │    │   Redis Cache   │
│     Service     │◄──►│   (Optional)    │
└─────────────────┘    └─────────────────┘
```

### Core Components

1.  **React Frontend**: Built with Vite, TypeScript, and Tailwind CSS for a snappy, modern UI.
2.  **Node.js API**: Express-based REST API handling authentication, user management, and quiz CRUD operations.
3.  **Go WebSocket Service**: A dedicated, high-performance service managing real-time game state and connections using Goroutines.
4.  **PostgreSQL**: Robust relational storage for persistent data like users, quizzes, and game history.
5.  **Redis**: (Optional) fast in-memory store for session management and caching.

## Tech Stack Deep Dive

### Frontend
The UI leverages **React** and **TypeScript** for type safety and component reusability. **Zustand** handles global state management, while **React Query** optimizes data fetching. The design is polished with **Tailwind CSS** and **shadcn/ui** components.

### Backend & Real-Time
The backend is split into two main services:
-   **API Service (Node.js)**: Manages business logic, Auth0 authentication, and database interactions via **Prisma ORM**.
-   **Socket Service (Go)**: The heart of the action. It uses Go's concurrency model to handle thousands of simultaneous connections, managing room lifecycles (Lobby -> Playing -> Reveal -> End) and broadcasting events.

### Scoring Algorithm
To keep games competitive, the scoring system rewards speed:
```go
func CalculateScore(responseTime int64, duration int64, streak int) int {
    timeFactor := 1.0 - (float64(responseTime) / float64(duration))
    streakBonus := float64(streak) * 0.1
    return int(1000 * timeFactor * (1 + streakBonus))
}
```

## Deployment

The project employs a robust CI/CD pipeline using **GitHub Actions** and **AWS**.
-   **Containerization**: Dockerfiles for each service (API, Socket, Frontend).
-   **Registry**: Images are pushed to Amazon ECR.
-   **Orchestration**: Deployed to an EC2 instance using Docker Compose.
-   **Security**: OIDC for secure GitHub-AWS authentication without long-lived credentials.

## Future Roadmap

-   **AI Integration**: Generating quizzes from text prompts using LLMs.
-   **Adaptive Difficulty**: Adjusting question difficulty based on player performance.
-   **Analytics Dashboard**: Detailed insights into player performance and quiz engagement.

You can play the live demo at [quiz.utkarshjoshi.com](https://quiz.utkarshjoshi.com). I also documented my journey of setting up a [zero-cost CI/CD pipeline](/posts/free-docker-pipeline) for this application, covering everything from AWS Free Tier to Cloudflare DNS.
