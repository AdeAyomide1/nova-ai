const express = require('express');
const cors = require('cors');
const os = require('os');
const path = require('path');
const si = require('systeminformation');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Serve the frontend folder ─────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const NOVA_SYSTEM_PROMPT = `You are NOVA — an advanced personal AI assistant with a futuristic, direct personality. You are displayed inside a sleek HUD interface.

Your traits:
- Concise but informative. Never ramble.
- Slightly confident and technical in tone.
- When doing research, summarize key findings clearly.
- When asked to do device tasks, describe what you would do.
- Always respond in plain text, no markdown formatting. Keep responses under 120 words unless the user asks for more detail.`;

// ── Gemini helper ─────────────────────────────────────────────────────────────
async function askGemini(messages, systemExtra = '') {
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const body = {
    system_instruction: {
      parts: [{ text: NOVA_SYSTEM_PROMPT + systemExtra }]
    },
    contents,
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.7,
    }
  };

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.error?.message || 'Gemini API error';
    throw new Error(msg);
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
}

// ── Chat endpoint ─────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { messages, systemStats } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  const statsContext = systemStats
    ? `\n\n[LIVE SYSTEM STATS] CPU: ${systemStats.cpu}% | RAM: ${systemStats.ramUsed}GB/${systemStats.ramTotal}GB | GPU Temp: ${systemStats.gpuTemp}°C | Storage: ${systemStats.storageC}`
    : '';

  try {
    const reply = await askGemini(messages, statsContext);
    res.json({ reply });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Research endpoint ─────────────────────────────────────────────────────────
app.post('/api/research', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });

  let searchContext = '';

  if (process.env.BRAVE_API_KEY && process.env.BRAVE_API_KEY !== 'your_brave_search_api_key_here') {
    try {
      const r = await fetch(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
        { headers: { 'Accept': 'application/json', 'X-Subscription-Token': process.env.BRAVE_API_KEY } }
      );
      const data = await r.json();
      const results = (data.web?.results || []).slice(0, 4);
      searchContext = results.map((r, i) => `[${i + 1}] ${r.title}: ${r.description}`).join('\n');
    } catch (e) {
      console.error('Brave search error:', e.message);
      searchContext = 'Search unavailable. Answering from training data.';
    }
  } else {
    searchContext = 'No Brave API key configured. Answering from training data.';
  }

  try {
    const reply = await askGemini([{
      role: 'user',
      content: `Research this topic: "${query}"\n\nSearch results:\n${searchContext}\n\nGive a concise, useful summary in plain text.`
    }]);
    res.json({ reply, sources: searchContext });
  } catch (err) {
    console.error('Research error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── System stats endpoint ─────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [cpu, mem, temp, disk, net, graphics] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.cpuTemperature(),
      si.fsSize(),
      si.networkStats(),
      si.graphics(),
    ]);

    const mainDisk = disk[0] || {};
    const netIface = net[0] || {};
    const gpu = (graphics.controllers || [])[0] || {};

    res.json({
      cpu: {
        total: Math.round(cpu.currentLoad),
        cores: (cpu.cpus || []).slice(0, 4).map(c => Math.round(c.load)),
      },
      ram: {
        used: parseFloat((mem.used / 1e9).toFixed(2)),
        total: parseFloat((mem.total / 1e9).toFixed(2)),
        percent: Math.round((mem.used / mem.total) * 100),
      },
      temp: {
        cpu: temp.main || 0,
        cores: (temp.cores || []).slice(0, 4),
      },
      disk: {
        name: mainDisk.fs || 'C:',
        used: Math.round((mainDisk.used || 0) / 1e9),
        total: Math.round((mainDisk.size || 1) / 1e9),
        percent: Math.round(mainDisk.use || 0),
      },
      network: {
        rx: Math.round((netIface.rx_sec || 0) / 1024),
        tx: Math.round((netIface.tx_sec || 0) / 1024),
      },
      gpu: {
        name: gpu.model || 'N/A',
        temp: gpu.temperatureGpu || 0,
        vram: gpu.memoryUsed && gpu.memoryTotal
          ? Math.round((gpu.memoryUsed / gpu.memoryTotal) * 100) : 0,
      },
      uptime: Math.floor(os.uptime()),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', nova: 'online', model: 'gemini-1.5-flash' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n  ╔══════════════════════════════════════╗`);
  console.log(`  ║   NOVA Backend (Gemini)  :${PORT}       ║`);
  console.log(`  ╚══════════════════════════════════════╝`);
  console.log(`\n  Model  : gemini-1.5-flash (free tier)`);
  console.log(`  Key    : ${GEMINI_API_KEY ? '✓ loaded' : '✗ MISSING — add GEMINI_API_KEY to .env'}`);
  console.log(`  Brave  : ${process.env.BRAVE_API_KEY && process.env.BRAVE_API_KEY !== 'your_brave_search_api_key_here' ? '✓ loaded' : '✗ not set (optional)'}`);
  console.log(`\n  ► Open http://localhost:3001 in Chrome\n`);
});
