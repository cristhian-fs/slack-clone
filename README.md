# 🧪 Slack Clone – Study Project

## Description

This is a Slack-inspired **study project** built using modern full-stack technologies. It replicates the core features of a real-time team communication platform, enabling messaging, reactions, threads, user roles, and more. The goal is to deepen understanding of scalable architecture, real-time data handling, and clean UI design.

---

## 🧰 Tech Stack

- **Next.js 14** – App Router, Server Components
- **Tailwind CSS** – Utility-first styling
- **Shadcn UI** – Accessible component library
- **Convex** – Real-time backend (database + functions)
- **NextAuth v5** – Authentication and session management
- **Vercel** – Deployment platform
- React Hook Form
- Zod para validação
- TypeScript

---

## 💡 Features

### 📡 Real-Time Messaging
- Live updates on messages, threads, and reactions
- Instant typing indicators (optional)

### 👍 Reactions
- React to messages with emojis
- Dynamic updates with optimistic UI

### 🧵 Threads
- Reply to specific messages
- View threaded conversations contextually

### ✏️ Message Editing
- Edit previously sent messages
- Sync updates in real-time

### 🗑️ Message Deletion
- Delete messages with permission control
- Soft delete optional for future undo features

### 🔐 Role-Based Access Control (RBAC)
- Admin and member roles
- Restricted access to management features

### 🖼️ Image Attachments
- Upload and send images in chat
- Preview inline with messages

### 🔒 Authentication
- Secure login with NextAuth v5
- OAuth and credentials provider support

### 📺 Channels
- Create and manage public or private channels

### 🏢 Workspaces
- Organize conversations by workspace
- Join via invite code

### ✉️ Invite System
- Generate invite codes for others to join workspaces

### 💬 Direct Messaging
- One-on-one private conversations
- Persistent history and real-time updates

### 👥 User Profiles
- View and update user details

---

## 🚀 Getting Started

To run locally:

```bash
# Install dependencies
bun install

# Start the dev server
bun dev
```

In another terminal, run the following command to init the convex dev:

```bash
bunx convex dev
```

Make sure to configure your .env file with the necessary environment variables for Convex and NextAuth.

## 📦 Deployment
This app is deployed on Vercel, with automatic CI/CD integration.

## 🎯 Purpose
This is a learning-focused project created to explore full-stack development with real-time features. It serves as a personal deep dive into the architecture of collaborative platforms like Slack.

## 🙌 Credits
This project was based on the Slack Clone Tutorial from [Code with antonio](codewithantonio.com)

Built using:

- [Convex](https://www.convex.dev/)
- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)

