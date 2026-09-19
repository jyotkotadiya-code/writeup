# WriteUp — Creative Serialized Fiction Platform

> **"Where stories find their readers."**

WriteUp is a full-stack web platform for writers to publish novels chapter-by-chapter and for readers to discover, like, wishlist, and vote for novels in genre awards.

Built with a simple, readable, beginner-friendly architecture suitable for a BSc IT student capstone or project presentation.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

You can install dependencies for both the frontend and backend with a single command from the project root:

```bash
npm run install:all
```

Or individually:
```bash
npm install
cd server && npm install
cd ../client && npm install
```

---

### 2. Configure MongoDB

WriteUp uses MongoDB via Mongoose.

1. Open `server/.env`
2. Configure your `MONGO_URI`:
   - **Local MongoDB**: `mongodb://127.0.0.1:27017/writeup`
   - **MongoDB Atlas Cloud**: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/writeup?retryWrites=true&w=majority`

Example `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/writeup
JWT_SECRET=writeup_jwt_secret_key_2025_simple
```

---

### 3. Seed Demo Data

Populate the database with pre-made novels across genres, chapters, active awards, and demo accounts:

```bash
npm run seed
```

#### Demo User Credentials:
| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@writeup.com` | `admin123` |
| **Writer** | `jane@example.com` | `password123` |
| **Writer** | `arthur@example.com` | `password123` |
| **Reader** | `maya@example.com` | `password123` |

---

### 4. Run WriteUp

Launch both the client and server concurrently with:

```bash
npm run dev
```

* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, React Router v6
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, CORS
- **Database**: MongoDB & Mongoose

---

## 📖 Key Workflows to Demo

### Flow 1: Writer Publishing & Admin Review Flow
1. Log in as **Writer** (`jane@example.com` / `password123`) or click **Sign Up** to create an author account.
2. Click **Create Novel** (`/create-novel`), choose a genre (e.g. Fantasy), add a title and description, and pick a cover.
3. On the **Author Studio** (`/my-novels`), click **+ Add Chapter** to publish chapter 1.
4. Click **Submit for Approval** (status becomes *Pending Review*).
5. Log out, then log in as **Admin** (`admin@writeup.com` / `admin123`).
6. Navigate to **Admin Control Center** (`/admin`) -> **Publishing Requests**.
7. Click **Approve & Publish**.
8. Go to **Home** (`/home`) — the novel is now immediately visible to the public!

### Flow 2: Reader Engagement Flow
1. Browse novels on `/home` or `/genres`.
2. Click the Heart button (♡) to like a novel and watch the counter increment.
3. Click the Bookmark button to save to your **Wishlist**.
4. Go to **Profile** (`/profile`) -> **Wishlist** tab to manage saved stories.
5. Click **Read Chapter 1** to enter the distraction-free reader with Next/Previous chapter controls.

### Flow 3: Awards & Community Voting Flow
1. Go to **Awards** (`/awards`).
2. Open an active competition (e.g. *Annual Romance Writing Awards*).
3. Click **Vote** on your favorite story. The vote is permanently recorded (1 vote per user per competition).
4. As **Admin**, visit `/admin` -> **Award Competitions** -> Click **Stop Voting** and **Declare Winner** to officially award the highest-voted novel!

---

## 📂 Project Architecture

```text
writeup/
├── package.json              # Concurrently runner
├── server/
│   ├── server.js             # Express app & MongoDB connection
│   ├── seed.js               # Demo dataset seeder
│   ├── createAdmin.js        # Admin generation script
│   ├── models/               # User, Novel, Chapter, Award, Vote
│   ├── routes/               # auth, novels, chapters, awards, admin
│   └── middleware/           # JWT auth & Admin check
└── client/
    ├── src/
    │   ├── context/          # AuthContext, ThemeContext (Dark/Light)
    │   ├── components/       # Navbar, Footer, NovelCard, GenreCard, AwardCard, Button
    │   └── pages/            # Landing, Home, About, Genres, NovelDetails, ChapterReader, Awards, Admin, Profile
```
