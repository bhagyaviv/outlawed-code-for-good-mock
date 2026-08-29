# OutLawed India — Intelligent Legal-Aid Knowledge & Case Management Platform

An intelligent legal-aid prototype designed for **OutLawed India** to streamline grassroots dispute resolution, organize institutional legal expertise, and leverage AI-assisted search across a centralized previous cases repository.

---

## 🚀 Product Concept & Rationale

OutLawed India supports rural communities by deploying field workers (**Nyaaya Mitras**) to log disputes on the ground. This platform facilitates communication between field workers, regional administrators, and senior legal experts through a secure, structured, and AI-enabled workspace.

### 👥 The Three Human Roles + AI Assistant:
1. **Nyaaya Mitra (The Doer):** Logs case files in communities (supporting voice-intake simulations), checks AI-suggested previous cases, schedules client follow-ups, drafts field notes, and escalates cases when human legal guidance is required.
2. **Coordinator (The Monitor):** Monitors regional workloads and active caseloads, tracks community issue distributions, and triages expert escalation requests. *The coordinator does not provide legal advice.*
3. **Legal Expert (The Guide):** Certified senior lawyers who review case histories, inspect uploaded files, compare similar cases, and submit professional legal advice directly into the Nyaaya Mitra case timelines.
4. **AI Assistant (First-Level Assistance):** An assistant that queries the centralized **Previous Cases Repository** to summarize how similar disputes were historically handled. *The AI is clearly demarcated from human legal experts to comply with legal advice guidelines.*

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite (SPA layout state routing)
- **Styling:** Tailwind CSS (utility-first styling, grid rosters, status badges)
- **Icons:** Lucide React
- **Mock Database:** Asynchronous Delay-backed JavaScript Service Layer (`src/services/` and `src/utils/`)

---

## 📂 Project Structure

```
05-PROJECT-TEMPLATE/
├── frontend/
│   ├── index.html                  # Browser page container (custom OutLawed title tab)
│   ├── src/
│   │   ├── components/             # Reusable UI Elements
│   │   │   ├── Button.jsx          # Custom styled buttons
│   │   │   ├── Card.jsx            # Panel containment grids
│   │   │   ├── Input.jsx           # Form inputs with inline error validation
│   │   │   ├── Select.jsx          # Form selection dropdowns
│   │   │   ├── Table.jsx           # Responsive rosters data tables
│   │   │   ├── Modal.jsx           # Inspect overlay popups
│   │   │   ├── StatusBadge.jsx     # Visual state colors (e.g., Active, Resolved)
│   │   │   ├── Navbar.jsx          # Sticky top bar with notifications bell & role switcher
│   │   │   └── Sidebar.jsx         # Navigation sidebar customization
│   │   │
│   │   ├── services/               # API-Ready Asynchronous Mock Services
│   │   │   ├── authService.js      # Session login simulation
│   │   │   ├── caseService.js      # Case files creation, notes, and task checkbox toggles
│   │   │   └── aiService.js        # AI prompt question records
│   │   │
│   │   ├── utils/                  # Central Mock Databases
│   │   │   ├── mockData.js         # Core active disputes database (cases #1056, #1042)
│   │   │   └── mockPreviousCases.js# exactly 50 anonymized previously resolved cases
│   │   │
│   │   └── pages/                  # Role Workspace Views
│   │       ├── Login.jsx           # Polished split-screen credentials & demo login buttons
│   │       ├── Profile.jsx         # Profile settings page
│   │       ├── NotFound.jsx        # Fallback routes panel
│   │       ├── Dashboard.jsx       # Nyaaya Mitra workspace dashboard & quick intake
│   │       ├── CreateCase.jsx      # Multi-step intake form wizard (Steps 1-4)
│   │       ├── CaseList.jsx        # Searchable and filterable case registry
│   │       ├── CaseDetails.jsx     # Case dossier details (Timeline, Tasks, Notes)
│   │       ├── AIAssistant.jsx     # Interactive chat assistant (PC-001 similarity search)
│   │       ├── KnowledgeSearch.jsx # Semantic citations search
│   │       ├── FollowUps.jsx       # outreach checklists calendars
│   │       ├── ExpertGuidance.jsx  # Logs of cases escalated for human guidance
│   │       ├── CoordinatorRequests.jsx # Coordinator reviews allocation board
│   │       ├── CoordinatorMitras.jsx  # Mitra tracking caseload grids
│   │       ├── CoordinatorInsights.jsx# Anonymized regional trends charts
│   │       └── ExpertCases.jsx     # Senior guide advisory desk
│   └── package.json
```

---

## ⚙️ Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

### 1. Installation
Navigate to the `frontend` folder and install dependencies:
```bash
cd frontend
npm install
```

### 2. Launch Development Preview
Run the local Vite preview development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your web browser.

### 3. Build for Production
Verify that the application compiles cleanly with zero compilation errors:
```bash
npm run build
```

---

## 🎬 Step-by-Step Demo Guide (The OutLawed Story)

### Step 1: Secure Login
1. Open the login page. Note the split-screen design. Left: Features summary cards. Right: Security-first credentials form.
2. Click **Try Nyaaya Mitra Workspace** to automatically login as **Ananya Rao**.

### Step 2: Nyaaya Mitra Work & Case Intake
1. On the dashboard, review the active caseload statistics and cases registry. Note the **Previous Cases** widget at the bottom right.
2. Click **Register New Case** in the sidebar. 
3. Fill out the multi-step wizard:
   - **Step 1:** Enter title: *"Land inheritance dispute after father's death"* and select *Land / Property* category.
   - **Step 2:** Click **Simulate Voice Translation (Kannada)** to record the Kannada intake notes, translating it into English.
   - **Step 3:** Enter client name: *"Gowramma K."*, location: *"K R Pet Taluk"*, and set urgency to *Important*.
   - **Step 4:** Review and submit. Click **View Case** to inspect the case details dossier.
4. On the dossier page, note the **🔒 Sensitive Information** mask. Click **Reveal Details** to show client contact information. Mark one of the follow-up tasks as done or write a field note.

### Step 3: AI Assistant Similarity Check
1. On the dossier page, notice the **Potentially Relevant Previous Cases** panel. Click **View Case** on **PC-001** to inspect an anonymized resolved land case.
2. Go back and click **Ask AI Assistant**.
3. In the chat, send the query: *"Have we handled similar land inheritance cases?"*.
4. The AI Assistant searches the centralized repository and returns **PC-001** (92%), **PC-019** (86%), and **PC-038** (81%) with direct links.
5. In the chat selection panel, click **No — Request Human Legal Expert** to launch the escalation request form. Enter details and submit.

### Step 4: Coordinator Review & Access Control
1. Switch roles to **Coordinator (Supervisor)** using the dropdown in the header navbar. Note that the profile name updates to **Suresh Kumar**.
2. Click **Expert Requests** in the sidebar.
3. Select **Case #1056** from the triage queue. Read the details, then click **Enable Human Expert Access**. Notice the status updates immediately.

### Step 5: Human Legal Expert Advisory
1. Switch roles to **Legal Expert (Guide)**. Note that the profile name updates to **Dr. Priya Sharma**.
2. Click **Cases for Review** in the sidebar.
3. Select **Case #1056** in the advisory desk. Note the Mitra's question. Type professional guidance comments in the text area and click **Submit Human Guidance**.

### Step 6: Case Resolution
1. Switch roles back to **Nyaaya Mitra**.
2. Open **My Cases** and select **Case #1056**.
3. Review the timeline. You will see that **Dr. Priya Sharma's** legal guidance comments have been recorded.
4. Click **Yes — Continue Case (Resolve)** to close the file.
