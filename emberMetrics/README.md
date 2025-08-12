# EmberMetrics — Frontend

A minimal **React + Vite** frontend for visualizing real-time system metrics from a Node.js API.  
The app displays CPU usage (per core and total), memory usage, and basic device information, refreshing automatically every second.

---

## Features

- Fetches metrics from the backend every 1 second.
- Displays:
    - **Hostname**
    - **Device information** (platform, OS, release, architecture, etc.)
    - **Total CPU usage** and **per-core usage**
    - **Memory usage** (used & available)
- No external UI or chart libraries — simple HTML rendering for now.

---

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- Native `fetch` API for HTTP requests

---

## API Reference

**Base URL** (development)
