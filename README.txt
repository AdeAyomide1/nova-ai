# Nova AI

> A locally-running personal AI assistant with computer control capabilities, voice output, and a futuristic interface — built for privacy-first, offline-first interaction.

![Status](https://img.shields.io/badge/status-prototype-yellow)
![Stack](https://img.shields.io/badge/stack-Node.js%20%2F%20JavaScript-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Overview

Nova AI is a desktop-based personal AI assistant that runs entirely on your local machine. Unlike cloud-dependent assistants, Nova keeps your data private by processing everything on-device. It combines a custom futuristic UI with real system-level control — letting you interact with your computer through natural language.

Currently in **prototype stage** with core features actively being developed.

---

## Features

| Feature | Status |
|---|---|
| Futuristic holographic UI | ✅ Working |
| Voice output (text-to-speech) | ✅ Working |
| File control & management | ✅ Working |
| System controls | ⚙️ Partial |
| Voice input (speech-to-text) | 🔄 In progress |
| Natural language commands | 🔄 In progress |
| Full desktop automation | 📋 Planned |

---

## Tech Stack

- **Runtime** — Node.js
- **Frontend/UI** — HTML, CSS, JavaScript (Electron)
- **Voice Output** — Web Speech API / Node TTS
- **File & System Control** — Node.js `fs`, `child_process`

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nova-ai.git

# Navigate into the project
cd nova-ai

# Install dependencies
npm install

# Start the app
npm start
```

---

## Project Structure

```
nova-ai/
├── main.js           # Electron main process
├── index.html        # UI entry point
├── css/
│   └── style.css     # Futuristic UI styles
├── js/
│   └── renderer.js   # UI logic & interactions
├── core/
│   ├── voice.js      # Voice output module
│   ├── files.js      # File control module
│   └── system.js     # System control module
└── package.json
```

---

## Roadmap

- [x] Custom futuristic UI
- [x] Voice output
- [x] File control
- [x] Basic system controls
- [ ] Voice input / speech recognition
- [ ] Natural language command parsing
- [ ] Full desktop automation
- [ ] Plugin/extension system

---

## Screenshots

> *(Add screenshots of your UI here)*

---

## Author

**Adebayo Suleiman Ayomide**
Computer Science, 200 Level — Veritas University Abuja
[GitHub](https://github.com/yourusername) · [Portfolio](https://yourportfolio.com)

---

## License

This project is licensed under the MIT License.