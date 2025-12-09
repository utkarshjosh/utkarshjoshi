---
title: "From Rusted Wires to Cloud Native: The Story of AquaMind"
date: 2025-12-09
draft: false
description: "How I built a professional-grade smart water monitoring system from scratch, evolving from high school experiments to a full-stack IoT platform."
image: "images/projects/aquamind-site-screenshot.png"
tags: ["IoT", "Node.js", "TypeScript", "PostgreSQL", "Firebase", "Flutter", "Arduino"]
---

*"It started with a battery-powered doorbell..."*

## The Spark: A Doorbell in the Cupboard

My journey into hardware and automation didn't start with complex microcontrollers or cloud architecture. It started with a simple observation. I had a **Gaurav Brand doorbell** lying unused in our cupboard. It was battery-powered and had a very sensitive latch switch.

I realized I could repurpose it. The problem was simple: our water tank would often overflow, wasting precious water. I rigged up a system where the rising water level would trigger the sensitive latch of the doorbell, ringing the bell and alerting us to turn off the pump.

It was primitive, but it prevented **water wastage**. That simple "ding" was the spark.

## The Evolution: Transistors and Corrosion

As I got deeper into hobbyist electronics, I wanted more than just a bell. I wanted to *see* the level. I developed a multipoint conductivity system using transistor gates. As the water rose, it would bridge contacts at different heights, turning on a series of LEDs to indicate the level.

It felt high-tech at the time, but reality soon set in. Electrolysis is a cruel mistress. My probes, constantly exposed to current and water, began to corrode. The system that looked so cool on day one was a rusted mess by day thirty. 

## The Professional Pivot

Years passed. I became a software engineer, working on complex systems and honing my coding skills. But that itch to build a robust physical device never went away. I knew I could do better than rusting wires. I wanted something professional, reliable, and scalable.

I tried existing solutions like **ThingsBoard**. It's a powerful platform, but for my use case? It felt like using a sledgehammer to crack a nut. It was too complex, too heavy, and frankly, taken the fun out of "building it yourself."

So, I decided to build my own solution. **AquaMind was born.**

---

## What is AquaMind?

AquaMind is my custom-developed, end-to-end smart water monitoring system. It's not just a sensor; it's a full-stack IoT platform designed to be robust, accurate, and user-friendly.

It monitors **real-time water levels** and **temperature**, stores critical data locally, and syncs with a cloud backend to provide alerts and analytics.

### The Hardware: Robust & Reliable

Gone are the corroding copper wires. AquaMind uses a **waterproof ultrasonic sensor** (like the JSN-SR04T) to measure distance without ever touching the water. 
- **Controller**: Powered by **ESP8266** and custom firmware compiled with **Arduino CLI**.
- **Storage**: Uses **LittleFS** for robust on-device data buffering (so no data is lost if WiFi drops).
- **Logic**: Smart filtering to ignore ripples and sudden spikes.

### The Backend: Power & Scalability

I leveraged my software engineering background to build a multi-tenant backend that can scale.
- **Runtime**: Node.js with **TypeScript** for type safety.
- **Database**: **PostgreSQL** for reliable, structured data storage.
- **Framework**: Express.js with robust validation using Zod.
- **Security**: Rate limiting, Helmet, and secure authentication flows.

### The Frontend: A Modern Experience

Users interact with AquaMind through two polished interfaces, both powered by **Firebase** for seamless real-time updates and authentication.

**1. The Admin Panel**
Built with **Next.js 14**, **Tailwind CSS**, and **Shadcn UI**. It features:
- Beautiful, responsive dashboards.
- specialized charts (Recharts) to visualize usage trends.
- Dark/Light mode support.

**2. The Mobile App**
A cross-platform app (Flutter) that puts your tank status in your pocket. Get push notifications for low levels, overflow warnings, or pump failures instantly.

---

## The Future: AI & Prediction

AquaMind is already miles ahead of my 10th-grade bell, but I'm just getting started. The roadmap includes:
- **AI Analysis**: Using machine learning to analyze usage patterns.
- **Smart Predictions**: "Based on your Sunday usage, your tank will run dry by 4 PM."
- **Leak Detection**: Identifying abnormal outflow when no taps should be running.

From a science fair experiment to a cloud-native IoT platform, AquaMind is proof that if you keep iterating, even a rusty idea can shine. 

*Stay tuned for more updates!*
