# NOVA AI — Personal Assistant HUD
> Futuristic voice-first AI with live PC monitoring

---

## What's Inside

```
nova-ai/
├── frontend/
│   └── index.html          ← The full HUD UI (open in browser)
├── backend/
│   ├── server.js           ← Express API (Claude + stats + research)
│   ├── package.json
│   └── .env.example        ← Rename to .env and fill your keys
├── start-windows.bat       ← One-click launcher (Windows)
├── start-mac-linux.sh      ← One-click launcher (Mac/Linux)
└── README.md
```

---

## Requirements

- **Node.js v18+** — https://nodejs.org (download LTS)
- **Google Chrome or Edge** — required for voice (Web Speech API)
- **Anthropic API Key** — https://console.anthropic.com
- **Brave Search API Key** *(optional, for web research)* — https://brave.com/search/api/

---

## Setup — Step by Step

### Step 1 — Install Node.js
Download from https://nodejs.org and install the **LTS version**.
After installing, open a terminal and confirm:
```
node --version   # should print v18.x or higher
```

### Step 2 — Get Your API Keys

#### Anthropic (Required)
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

#### Brave Search (Optional — enables real web research)
1. Go to https://brave.com/search/api/
2. Sign up for the free tier (2000 queries/month free)
3. Copy your API key

### Step 3 — Configure Your Keys
1. Open the `backend` folder
2. Copy `.env.example` → rename it to `.env`
3. Open `.env` in any text editor (Notepad works)
4. Fill in:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
BRAVE_API_KEY=your-brave-key-here   ← optional
PORT=3001
```
5. Save the file

### Step 4 — Install Dependencies
Open a terminal inside the `backend` folder and run:
```bash
npm install
```
This downloads: Express, Anthropic SDK, systeminformation, CORS, dotenv.

### Step 5 — Start NOVA

**Windows:** Double-click `start-windows.bat`

**Mac/Linux:**
```bash
chmod +x start-mac-linux.sh
./start-mac-linux.sh
```

**Or manually:**
```bash
# Terminal 1 — start backend
cd backend
node server.js

# Then open frontend/index.html in Chrome
```

### Step 6 — Use NOVA
1. Open `frontend/index.html` in **Chrome or Edge**
2. When asked for microphone permission → click **Allow**
3. Click the **glowing orb** in the center
4. Speak your command
5. NOVA listens → thinks → speaks back

---

## Features

| Feature | How it works |
|---|---|
| **Voice Input** | Web Speech API (Chrome built-in, free) |
| **AI Responses** | Claude Sonnet via Anthropic API |
| **Text-to-Speech** | Browser SpeechSynthesis (free) |
| **Web Research** | Brave Search API → summarized by Claude |
| **Live PC Stats** | `systeminformation` Node.js library (real data) |
| **Simulated Stats** | Falls back to animated simulation if backend is offline |
| **Type Mode** | Use the text input bar instead of voice |

---

## Modes

Click the mode buttons in the center panel:

- **VOICE** — Tap orb, speak, NOVA responds with voice
- **RESEARCH** — Tap orb or type, NOVA searches the web first then answers
- **TYPE** — Type in the input bar, press Enter or click SEND

---

## Troubleshooting

**"Cannot reach NOVA backend"**
→ Make sure the backend is running (`node server.js` in `/backend`)
→ Check terminal for errors

**No voice input / microphone not working**
→ Must use Chrome or Edge (Firefox does not support Web Speech API)
→ Allow microphone when browser asks
→ Check your system mic settings

**Stats show simulated data**
→ Normal if backend is offline. Once backend starts, real stats load within 3 seconds.

**NOVA says something wrong / slow**
→ Check your `ANTHROPIC_API_KEY` in `.env`
→ Make sure you have API credits at console.anthropic.com

**Brave Search not working**
→ Check `BRAVE_API_KEY` in `.env`
→ Without it, NOVA answers from Claude's training data only (still works)

---

## Customization

### Change NOVA's personality
Open `backend/server.js` → edit `NOVA_SYSTEM_PROMPT`

### Change voice
Open `frontend/index.html` → find the `speak()` function → change voice name preference

### Change accent color
Open `frontend/index.html` → search for `#e8a020` (amber/orange) → replace with any hex color
- Blue HUD: `#2090e8`
- Green HUD: `#20e860`
- Red HUD: `#e83020`

---

## What's Next (Phase 2 — Agent Mode)

To enable real device control (open apps, manage files, run scripts):
1. Install Python 3 + `pip install fastapi uvicorn psutil`
2. Run a local Python agent on port 3002
3. NOVA backend will route "agent" commands to it
4. The Python agent executes OS-level tasks

This is marked as **WARN** in the HUD modules panel — coming in the next build.

---

Built with Claude Sonnet · Express · Web Speech API · systeminformation
