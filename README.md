# Auction System

A real-time auction platform built with **Node.js**, **Socket.io**, and **PHP**. This system allows users to create, join, and bid on property auctions with live updates.

---

## Features

### ✅ User Authentication
- Secure registration and login system with password hashing.

### 🏘️ Auction Management
- Create new property auctions with detailed listings.
- View active auctions.
- Join ongoing auctions.

### 🔁 Real-time Bidding
- Live bidding updates for all participants in an auction using Socket.io.

### 🛠️ Admin Dashboard (Console)
- Server-side administrative commands to monitor and manage auctions and users.

### 🔄 Automated Auction States
- Auctions automatically change states between **Waiting**, **Active**, and **Closed** based on scheduled times.

---

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Socket.io (for real-time updates)

### Backend
- Node.js with Express
- Socket.io server

### Database
- MySQL with PDO connections
- Tables for:
  - Users
  - Auctions
  - Bids

---

## Installation

### 1. Clone the Repository
```bash
git clone [repository-url]
cd auction-system
