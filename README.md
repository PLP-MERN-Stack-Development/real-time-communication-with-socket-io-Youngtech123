# Real-Time Chat App with Socket.IO, Rooms, and Authentication

## Overview

This is a **real-time chat application** built using **Node.js, Express, Socket.IO, and React**. The app allows multiple users to join **chat rooms**, send messages, see who is typing, and receive notifications when users join or leave a room. A simple **authentication system** ensures that only registered users can join chats.  

The UI has been designed to be clean, professional, and user-friendly.

---

## Features

### 1. **User Authentication**
- Users can **register** with a username and password.
- Users can **log in** before accessing chat rooms.
- Simple in-memory authentication for demonstration (can be extended with database).

### 2. **Chat Rooms**
- Users can select from multiple rooms (e.g., **General**, **Sports**, **Music**).
- Messages are **isolated to the selected room**.
- Users can switch rooms (requires rejoining).

### 3. **Real-Time Chat**
- Users can **send and receive messages instantly** using Socket.IO.
- Each message shows the **sender's username**.
- Messages include **system notifications** for join/leave events.

### 4. **Typing Indicator**
- Shows when a user is typing a message in real time.
- Updates dynamically as users start/stop typing.

### 5. **Responsive and Clean UI**
- Centralized chat container with shadow and rounded corners.
- Clear message layout with different styles for system messages and user messages.
- Highlighted room selection for easy navigation.

---

## Tech Stack

- **Backend**: Node.js, Express, Socket.IO, HTTP, dotenv  
- **Frontend**: React (with functional components and hooks)  
- **Database**: MongoDB (connected, can be used for message persistence if extended)  
- **Other**: CORS middleware, in-memory authentication for demo

---

