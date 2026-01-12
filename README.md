# Zync — Stay Focused, Stay Synced

Zync is a **real-time collaborative study app** that helps students stay focused and accountable through shared study rooms and synchronized focus sessions.

🔗 **Live Demo:** https://zyncs.vercel.app

---

## What is Zync?

Zync makes group studying simple and distraction-free.

Instead of studying alone and losing focus, users can:
- Create or join shared study rooms
- Study together using a synchronized focus timer
- Stay accountable with live participants
- Rejoin rooms smoothly after disconnection

Zync is built with a **focus-first mindset** and real-time collaboration at its core.

---

## Features

- **Shared Focus Timer**
  - One timer synchronized across all participants
  - Everyone studies for the same duration

- **Real-Time Study Rooms**
  - Live participant join/leave updates
  - No duplicate users on refresh

- **Dynamic Room Ownership**
  - Ownership automatically reassigns if the host disconnects
  - Grace period before ownership is finalized

- **Reconnect Friendly**
  - Users can safely refresh or rejoin rooms
  - Active and inactive rooms handled cleanly

- **Minimal & Focused UI**
  - Designed to reduce distractions
  - Study-first experience

---

## Screenshots

### Landing Page
<img width="620" height="400" alt="image" src="https://github.com/user-attachments/assets/6880881b-470a-4229-baac-557627287c42" />

### Study Room
<img width="620" height="424" alt="image" src="https://github.com/user-attachments/assets/46214179-465d-421f-9850-7424c36022cd" />

### Active Focus Session
<img width="620" height="400" alt="image" src="https://github.com/user-attachments/assets/ec24c4c1-aaff-4653-8ec7-f9fdba1dcc64" />

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO

### Deployment
- Frontend: Vercel
- Backend: Render

---

## How It Works

1. User creates or joins a study room
2. Room maintains a real-time participant list
3. Participants start a focus session
4. Timer synchronizes across all users
5. Session ends simultaneously for everyone

---

## Local Setup

```bash
# Clone the repository
git clone https://github.com/himanshukumarshah/real_time_collaborative_study_planner.git

# Frontend
cd client
npm install
npm run dev

# Backend
cd ../server
npm install
npm run dev

```
