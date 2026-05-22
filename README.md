# SmartOffice AI – SME Assistant

**Author:** Swatsi Ratia · CAPACITI AI Skill Accelerator Programme
**Live app:** https://smartflow-ai-aid.lovable.app

> Scan the QR code on the deck (`SmartOffice-AI-SME-Assistant.pptx`) to open the live app on any mobile device during the presentation.

---

## 1. Project Overview

**SmartOffice AI SME Assistant** is an AI-powered productivity platform designed
to help **non-technical workplace staff** automate the repetitive administrative
tasks that quietly eat up their day — writing emails, summarising meetings,
planning schedules, doing quick research and answering workplace questions.

The platform is delivered as a modern, responsive SaaS web app with a clean
enterprise feel, built so it could realistically be sold to small businesses,
schools, retail teams and municipal offices in South Africa.

The project demonstrates:

- A practical, real-world use of AI in the workplace
- Strong prompt engineering tuned per task
- Responsible / ethical AI usage with human-in-the-loop review
- A measurable productivity uplift for SME teams

Built as part of the **CAPACITI AI Skill Accelerator Programme**.

---

## 2. Features

| # | Tool | What it does |
|---|------|--------------|
| 1 | ✉️ **Smart Email Generator** | Drafts professional emails with selectable tone (formal, friendly, persuasive) and audience (client, manager, team). Output is editable Markdown. |
| 2 | 📝 **Meeting Notes Summarizer** | Turns messy notes into a clean summary with **Key Decisions**, **Action Items (owner + deadline)** and **Deadlines**. |
| 3 | 📅 **AI Task Planner / Scheduler** | Builds daily or weekly time-blocked plans prioritised Eisenhower-style (do / schedule / delegate / drop). |
| 4 | 📚 **AI Research Assistant** | Plain-language overview, key insights, recommendations and "things to verify" for any workplace topic. |
| 5 | 💬 **Workplace Chat Assistant** | Multi-thread conversational AI with streaming responses for ongoing workplace discussions. |
| 6 | 📱 **Mobile QR Access** | A branded QR code (with embedded logo) is shown on the dashboard, the sidebar and the presentation deck so audiences and staff can scan and open the app on their phones instantly. |
| 7 | 🛡️ **Responsible-AI Disclaimer** | Every page reminds users: *"AI can make mistakes. Verify important workplace decisions before use."* |

---

## 3. Tools Used

**Frontend**
- React 19
- TanStack Start (routing, SSR, typed server functions)
- Tailwind CSS v4 with custom enterprise design tokens
- shadcn/ui component library
- `qrcode.react` for in-app QR codes

**AI**
- Lovable AI Gateway (ChatGPT-class models via a single API key)
- Dedicated system + user prompts per tool

**Tooling & Delivery**
- Vite 7 build pipeline
- GitHub for version control
- Vercel / Cloudflare-ready edge deployment
- `pptxgenjs` + `qrcode` (Node) for the generated presentation

---

## 4. Setup Instructions

### Prerequisites
- Node.js 20+ and `bun` (or `npm`/`pnpm`)
- A Lovable Cloud / Lovable AI Gateway key set as `LOVABLE_API_KEY`

### Run the app locally

```bash
# 1. Clone
git clone https://github.com/<your-username>/smartoffice-ai-sme-assistant.git
cd smartoffice-ai-sme-assistant

# 2. Install
bun install      # or: npm install

# 3. Environment
echo "LOVABLE_API_KEY=your-key-here" > .env

# 4. Start the dev server
bun run dev      # or: npm run dev

# 5. Open
http://localhost:5173
```

### Build for production

```bash
bun run build
bun run start
```

### Regenerate the presentation deck

The deck (`SmartOffice-AI-SME-Assistant.pptx`) is generated programmatically
with `pptxgenjs` and includes a live QR code pointing to the deployed app.

```bash
npm i -g pptxgenjs qrcode
node scripts/build-deck.js
```

---

## 5. Responsible AI

- A persistent disclaimer is shown on every screen.
- All AI output is **editable** before the user sends, saves or acts on it.
- Prompts steer the model toward neutral, professional, non-biased language.
- No chat history is persisted server-side by default.
- No login is required to try the demo — lowering risk for first-time users.

---

## 6. Author

**Swatsi Ratia**
CAPACITI AI Skill Accelerator Programme

## 7. License

Developed for educational and demonstration purposes as part of CAPACITI.
