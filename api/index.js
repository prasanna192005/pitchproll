require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cipher = require('./cipher');

const app = express();

// ==========================================
// CONFIGURATION (Vercel uses process.env)
// ==========================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DEFAULT_KEY = process.env.HASH_KEY;

// MIDDLEWARE: Indestructible Parsing
app.use(express.text({ type: () => true }));
app.use((req, res, next) => {
    if (typeof req.body === 'string') {
        try {
            req.body = JSON.parse(req.body);
        } catch (e) {}
    }
    next();
});

app.use(cors());

// Note: In Vercel, static files in /public are served automatically at /
// but we keep this for local compatibility.
app.use(express.static('public'));

// ==========================================
// GET ROUTES (Browser Friendly)
// ==========================================
app.get('/encrypt', (req, res) => {
    const { prompt } = req.query;
    if (!prompt) return res.status(400).send("Usage: /encrypt?prompt=hello");
    
    const encrypted = cipher.encrypt(prompt, DEFAULT_KEY);
    res.json({ encryptedPrompt: encrypted });
});

app.get('/decrypt', (req, res) => {
    const { data } = req.query;
    if (!data) return res.status(400).send("Usage: /decrypt?data=U2FsdGVk...");
    
    const decrypted = cipher.decrypt(data, DEFAULT_KEY);
    if (!decrypted) return res.status(401).send("Decryption failed. Data might be corrupted.");
    
    res.json({ decryptedText: decrypted });
});

app.get('/test', (req, res) => {
    const testText = "Hello Gemini. What is 2+2?";
    const encrypted = cipher.encrypt(testText, DEFAULT_KEY);
    res.json({
        message: "Test Payload Generated",
        payload: encrypted,
        key: "HARDCODED",
        instruction: "Send this payload via POST to /cipher"
    });
});

// ==========================================
// POST ROUTES (API Link)
// ==========================================

app.post('/encrypt', (req, res) => {
    const { prompt } = req.body;
    const encrypted = cipher.encrypt(prompt, DEFAULT_KEY);
    if (!encrypted) return res.status(400).json({ error: "Missing prompt" });
    res.json({ encryptedPrompt: encrypted });
});

app.post('/decrypt', (req, res) => {
    const { data } = req.body;
    const decrypted = cipher.decrypt(data, DEFAULT_KEY);
    if (!decrypted) return res.status(401).json({ error: "Decryption failed" });
    res.json({ decryptedText: decrypted });
});

app.post(['/cipher', '/cypher'], async (req, res) => {
    let { encryptedPrompt } = req.body;

    console.log(`\nNeural Link Activated at ${new Date().toISOString()}`);

    if (!encryptedPrompt) {
        return res.status(400).json({ error: "Missing encryptedPrompt" });
    }

    try {
        const decryptedPrompt = cipher.decrypt(encryptedPrompt, DEFAULT_KEY);
        if (!decryptedPrompt) {
            return res.status(401).json({ error: "Decryption failed." });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const result = await model.generateContent(decryptedPrompt);
        const response = await result.response;
        const text = response.text();

        const encryptedResponse = cipher.encrypt(text, DEFAULT_KEY);
        res.json({ encryptedResponse });

    } catch (err) {
        res.status(500).json({ error: "Neural Link Interrupted", details: err.message });
    }
});

// EXPORT FOR VERCEL
module.exports = app;

// LOCAL RUN
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`🚀 Local server running at http://localhost:${port}`);
    });
}
