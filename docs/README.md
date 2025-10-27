# FreshIcons Backend

**FreshIcons Backend** — a TypeScript-powered API built with **Zuplo**, serving as the backend gateway and developer portal for [FreshIcons.co](https://freshicons.co).

![FreshIcons Backend](./public/freshicons-backend.png)

---

## Overview

This repository contains the backend API and developer portal for **FreshIcons**, powered by **Zuplo**.  
It manages API routes, authentication, and documentation, allowing developers and services to securely interact with FreshIcons’ core functionality.

The project is written in **TypeScript** and uses **Zudoku** (Zuplo’s documentation system) to automatically generate and publish API documentation with each deployment.

---

## Features

- TypeScript-first API gateway using **Zuplo**
- Auto-generated API documentation via **Zudoku**
- Middleware support for logging, auth, and rate limiting
- Route-based architecture for scalable API design
- Environment-based configuration for deployment flexibility

---

## Tech Stack

- **Zuplo** — API gateway and deployment  
- **Zudoku** — Developer documentation  
- **TypeScript** — Type safety and maintainability  
- **Node.js** — Runtime environment  

---

## Getting Started

### 1. Clone the repository

    git clone https://github.com/kelsiesmurphy/freshicons-backend.git
    cd freshicons-backend

### 2. Install dependencies

    npm install
    # or
    pnpm install

---

## Local Development

Run the development server:

    npm run dev

This starts the local Zuplo instance with live reload.  
You can access the developer portal locally to preview API docs and routes.

---

## Build and Deployment

To build for production:

    npm run build

To deploy via Zuplo CLI or dashboard:

    zuplo deploy

Your **Zudoku** developer portal will automatically update with the latest routes and API documentation after each publish.

---

## Learn More

- [Zuplo Documentation](https://zuplo.com/docs)
- [Zudoku Developer Portal Guide](https://docs.zuplo.com/zudoku)
- [FreshIcons Frontend Repository](https://github.com/kelsiesmurphy/freshicons-frontend)

---

## Author

**Kelsie Murphy**  
- Portfolio: [kelsiesmurphy.com](https://kelsiesmurphy.com)  
- GitHub: [@kelsiesmurphy](https://github.com/kelsiesmurphy)

---

**FreshIcons Backend** — built with Zuplo, powered by TypeScript.
