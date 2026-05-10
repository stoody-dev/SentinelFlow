# SentinelFlow

Realtime AI-powered anomaly intelligence platform built for ingesting, analyzing, and visualizing live web threat signals.

![SentinelFlow Banner](https://img.shields.io/badge/status-live-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Fastify](https://img.shields.io/badge/Fastify-backend-lightgrey)
![Socket.IO](https://img.shields.io/badge/WebSocket-realtime-red)

---

## Overview

SentinelFlow is a realtime cyber/intelligence monitoring system that:

- Scrapes live web sources using the Anakin API
- Detects anomalous or suspicious events
- Streams updates through WebSockets
- Performs lightweight anomaly scoring
- Displays live intelligence feeds on a low-latency dashboard

The system is designed like a modern SOC/threat intelligence console with realtime event streaming and anomaly visualization.

---

## Features

- Realtime event ingestion
- AI-powered web scraping
- Live anomaly scoring
- WebSocket streaming
- Low-latency dashboard updates
- Threat/event categorization
- Realtime trend visualization
- Dark-mode SOC-inspired UI
- Fastify backend architecture
- Next.js frontend dashboard

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- TailwindCSS
- Recharts
- Socket.IO Client

### Backend
- Node.js
- Fastify
- Socket.IO
- TypeScript

### APIs
- Anakin.io URL Scraper API

---

# Architecture

```text
Web Source
    ↓
Anakin API Scraper
    ↓
Normalization Engine
    ↓
Anomaly Scoring Engine
    ↓
Fastify Backend
    ↓
Socket.IO Stream
    ↓
Realtime Dashboard
```

---

# Screenshots

## Live Dashboard

- Realtime anomaly trend graph
- Event severity scoring
- Threat feed cards
- Live websocket updates

---

# Installation

## Clone Repository

```bash
git clone https://github.com/stoody-dev/SentinelFlow.git
cd SentinelFlow
```

---

# Backend Setup

```bash
npm install
```

Create `.env`

```env
ANAKIN_API_KEY=your_api_key_here
```

Run backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

---

# Frontend Setup

```bash
cd dashboard
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3001
```

---

# API Usage

## Ingest URL

### Endpoint

```http
POST /ingest
```

### Request Body

```json
{
  "url": "https://news.ycombinator.com"
}
```

### Example Response

```json
{
  "success": true,
  "event": {
    "source": "news.ycombinator.com",
    "category": "cybersecurity",
    "tags": ["ransomware"],
    "anomalyScore": 5.5
  }
}
```

---

# Realtime Streaming

SentinelFlow streams events using Socket.IO.

Frontend clients automatically receive:

- New anomaly events
- Live dashboard updates
- Trend graph updates

---

# Project Structure

```text
SentinelFlow/
│
├── src/
│   ├── routes/
│   ├── services/
│   ├── normalizers/
│   ├── analyzers/
│   └── index.ts
│
├── dashboard/
│   ├── app/
│   ├── components/
│   └── lib/
│
├── .env
├── package.json
└── README.md
```

---

# Future Improvements

- Kafka event pipeline
- Redis caching
- Multi-source ingestion
- Vector search
- AI threat classification
- LLM-powered summarization
- Distributed ingestion workers
- Advanced anomaly ML models


---

# Author

Akshay Choudhary

GitHub:
https://github.com/stoody-dev

---

# License

MIT