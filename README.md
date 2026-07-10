# 📋 Kanban Board — MERN Stack

A fully functional, highly responsive collaborative Kanban board (Trello-style) built with MongoDB, Express, React, and Node.js. Supports drag-and-drop task management, real-time search/filtering, and mock team-member authentication.

---

## ✨ Features

- **Full CRUD** on tasks — create, read, update, delete
- **Dual interaction model** — drag-and-drop (`@hello-pangea/dnd`) *and* "move to next/previous column" buttons, so the board works well with mouse, touch, or keyboard-first workflows
- **Mock authentication** — switch between team members to simulate task assignment, no real login required
- **Real-time search & filtering** — debounced keyword search plus priority filtering
- **Optimistic UI updates** — cards move instantly on drag-drop while the change syncs to the server in the background
- **Per-task loading & error states** — every update/delete shows inline feedback, not just a single global spinner
- **Fully responsive** — columns stack vertically on mobile and sit side-by-side from tablet width up
- **Centralized, layered error handling** — schema-level validation (Mongoose) + route-level validation (`express-validator`) + centralized Express error middleware

---

## 🛠 Tech Stack

**Frontend**
- React (Vite)
- Redux Toolkit — board/task state (high-frequency, cross-component updates)
- Context API — current user / mock auth (low-frequency, shallow state)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Axios
- `@hello-pangea/dnd` — actively maintained fork of `react-beautiful-dnd`

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- express-validator

---

## 📁 Project Structure

```
kanban-board-mern/
├── client/                      # React frontend (Vite)
│   ├── src/
│   │   ├── app/                 # Redux store configuration
│   │   ├── components/          # Feature components
│   │   │   └── ui/              # Reusable primitives (Button, Input, Modal, etc.)
│   │   ├── context/              # UserContext (mock auth)
│   │   ├── features/tasks/      # Redux slice (tasksSlice.js)
│   │   ├── hooks/                # Custom hooks (useDebounce)
│   │   ├── pages/                # Board.jsx (main dashboard)
│   │   ├── services/             # Axios instance
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Express backend
│   ├── config/                   # DB connection
│   ├── controllers/              # Route handler logic
│   ├── middleware/               # Validation + centralized error handling
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # API route definitions
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A MongoDB connection string — either a local MongoDB instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/kanban-board-mern.git
cd kanban-board-mern
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables

**`server/.env`** — copy from `server/.env.example`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/kanban-board
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**`client/.env`** — copy from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the app

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev
```

```bash
# Terminal 2 — Frontend
cd client
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Get all tasks. Supports `?column=`, `?priority=`, `?search=` query params |
| `POST` | `/tasks` | Create a new task |
| `PUT` | `/tasks/:id` | Update a task's fields or move it to a different column |
| `PATCH` | `/tasks/reorder` | Bulk-update task order/column (used by drag-and-drop) |
| `DELETE` | `/tasks/:id` | Delete a task |

<details>
<summary><strong>Example: Create a task (POST /tasks)</strong></summary>

**Request body:**
```json
{
  "title": "Design login page",
  "description": "Create wireframes for the login flow",
  "column": "todo",
  "priority": "high",
  "assignee": "Fozan Makrani"
}
```

**Response — `201 Created`:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1f9e2c9d1a2b3c4d5e6f7",
    "title": "Design login page",
    "description": "Create wireframes for the login flow",
    "column": "todo",
    "priority": "high",
    "assignee": "Fozan Makrani",
    "order": 0,
    "createdAt": "2026-07-10T10:00:00.000Z",
    "updatedAt": "2026-07-10T10:00:00.000Z"
  }
}
```
</details>

### Task Schema

| Field | Type | Notes |
|---|---|---|
| `title` | String | Required, max 100 characters |
| `description` | String | Optional, max 500 characters |
| `column` | String | `todo` \| `in-progress` \| `done` (default: `todo`) |
| `priority` | String | `low` \| `medium` \| `high` (default: `medium`) |
| `assignee` | String | Mock team member name (default: `Unassigned`) |
| `order` | Number | Position within its column, used for stable drag-drop sorting |
| `createdAt` / `updatedAt` | Date | Auto-managed by Mongoose timestamps |

---

## 🧠 Notable Design Decisions

A few deliberate choices worth calling out, along with the reasoning:

- **`@hello-pangea/dnd` instead of `react-beautiful-dnd`.** The original library is deprecated and no longer maintained by Atlassian. This is the actively maintained community fork with an identical API — a more current, production-appropriate choice.
- **`order` field on the Task schema.** Not explicitly required by the original spec, but necessary for stable card positioning within a column when reordering via drag-and-drop.
- **Redux Toolkit + Context API, split by responsibility.** The task board (frequent, cross-component updates) uses Redux Toolkit. The current-user session (infrequent, shallow) uses Context — avoiding both prop-drilling and unnecessary Redux boilerplate for simple state.
- **Optimistic UI updates on drag-and-drop.** The UI updates immediately on drop, with the API call completing in the background, for a responsive feel rather than waiting on a network round-trip.
- **Both drag-and-drop and manual move buttons are supported.** This covers touch devices, accessibility needs, and simple click-based interaction alongside full drag-and-drop.
- **`GET /api/tasks` returns a flat, sorted array rather than pre-grouped columns.** Grouping into per-column lists happens on the frontend (`Board.jsx`), keeping the API more flexible for filtering/searching while the client handles presentation.

---

## 🧪 Testing the API

A Postman collection covering all endpoints — happy paths and edge cases (invalid IDs, validation failures, empty payloads, etc.) — can be built using the base URL `http://localhost:5000/api/tasks`. Recommended collection variable: `baseUrl`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Fozan Makrani**
Built as a technical assessment for the Full-Stack MERN Developer position.