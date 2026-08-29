# Code for Good Hackathon UI Starter Template

A reusable, professional, and responsive dashboard starter template designed for a 3-person hackathon team. Built to be domain-neutral and easily customizable within minutes.

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS (utility-first, responsive grid layout)
- **Icons:** Lucide React
- **API Client:** Axios (pre-configured with request/response interceptors)
- **Backend:** Node.js + Express (cors, error handling middleware, and structure placeholders)

---

## 📂 Folder Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable atomic UI components (Button, Modal, Table, etc.)
│   │   ├── pages/              # Primary page views (Login, Dashboard, Profile, etc.)
│   │   ├── services/           # Axios setup & interceptors
│   │   ├── hooks/              # Custom React hooks folder placeholder
│   │   ├── utils/              # Helper utility methods placeholder
│   │   ├── App.jsx             # Authentication and client router state manager
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind base integrations
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── routes/                 # Express Router endpoint definitions
│   ├── controllers/            # Request processing & database query handlers
│   ├── models/                 # Database schema models folder placeholder
│   ├── middleware/             # Error handlers & authentication checkers
│   ├── services/               # Business logic / integration helpers
│   ├── utils/                  # Backend utility methods
│   ├── server.js               # Node Express server entrypoint
│   └── package.json
│
├── .env.example                # Template configuration values for environment setup
├── .gitignore                  # Exclusions for node_modules and real secret environment files
└── README.md                   # This instruction file
```

---

## ⚙️ Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# (Optional) Run the backend in development hot-reload mode
npm run dev
```

The server will spin up on `http://localhost:5000`.

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the local Vite preview development server
npm run dev
```

The Vite client will launch on `http://localhost:5173`. Open it in your web browser.

---

## 🔒 Environment Variables

Copy the `.env.example` file in the root of the project to your own private `.env` file:

```bash
cp .env.example .env
```

### Configuration Keys:
- `PORT`: Node server port (default: `5000`)
- `CLIENT_URL`: Allowed Origin URL for CORS (default: `http://localhost:5173`)
- `DATABASE_URL`: Connection string placeholder for databases (MongoDB/PostgreSQL)
- `AUTH_SECRET`: Secret hash token for JWT session signatures
- `API_KEY`: Placeholder for external API integrations

> [!WARNING]
> **CRITICAL SECURITY RULE:** Never commit your `.env` file containing real passwords, database links, or secret keys to GitHub. It is already added to `.gitignore`.

---

## 🌐 Available API Endpoints

- **GET `/api/health`**
  - **Description:** Health check validation to ensure backend is running.
  - **Response:** `{"status": "ok", "timestamp": "...", "env": "..."}`

---

## 🚀 WHAT WE CHANGE TOMORROW
Once the actual problem statement is revealed, prioritize these changes:

1. **Rename the Project:**
   - Update `<title>` in `frontend/index.html`.
   - Update `projectName` in `frontend/src/App.jsx`.
   - Update titles on the `Login` page.
2. **Apply Theme Branding:**
   - Modify the custom color definitions (specifically `colors.primary`) in `frontend/tailwind.config.js` to match the target organization or brand palette.
3. **Connect Real Backend Endpoint & Services:**
   - Replace the simulated database arrays inside `frontend/src/pages/Dashboard.jsx` with real data fetched via `apiClient.get(...)` from `frontend/src/services/api.js`.
   - Implement real user credentials validation inside `frontend/src/pages/Login.jsx` using `apiClient.post('/auth/login', ...)`.
4. **Create API Routes:**
   - Add express routes in `backend/routes/` and register them under `backend/server.js`.
   - Add mongoose models in `backend/models/` or SQL schemas to bind with your datastore URL.
