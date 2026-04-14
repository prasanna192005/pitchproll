# 🔐 Cipher Gemini: Basic Pro Max

A minimalist, high-performance web interface and API for **End-to-End Encrypted (E2EE)** communication with Gemini 3 Flash. 

Designed for both the browser and Postman, Cipher Gemini ensures your prompts and responses are locked with AES-256 before they ever touch the network.

---

## 🚀 Features
- **Frontier Performance**: Powered by Google's `gemini-3-flash-preview`.
- **Bulletproof Security**: AES-256 encryption/decryption using a shared secret key.
- **Dual Interface**: Use the sleek "Studio" web UI or direct POST requests.
- **Zero-Config Deployment**: Optimized for Vercel Serverless Functions.

---

## 🛠️ Quick Start (For Noobs)

### 1. Local Setup
1.  **Clone the repo**:
    ```bash
    git clone https://github.com/prasanna192005/pitchproll.git
    cd pitchproll
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup your keys**: Create a file named `.env` in the root and add:
    ```env
    GEMINI_API_KEY=your_key_here
    HASH_KEY=jp1234
    ```
4.  **Run the server**:
    ```bash
    node api/index.js
    ```
    Visit `http://localhost:3000` to see it in action!

### 2. Vercel Deployment
1.  Push your code to GitHub.
2.  Import to Vercel.
3.  **IMPORTANT**: Go to Vercel **Settings > Environment Variables** and add your `GEMINI_API_KEY` and `HASH_KEY`.

---

## 🔄 The Encryption Loop
To stay 100% secure, follow this workflow in Postman:

1.  **LOCK IT**: Send your request to `/encrypt` to get a cipher.
2.  **PROCESS IT**: Send that cipher to `/cypher`. Gemini processes it and sends back an encrypted response.
3.  **UNLOCK IT**: Send Gemini's response to `/decrypt` to read the answer.

---

## 📡 API Reference

| Endpoint | Method | Purpose | Input |
| :--- | :--- | :--- | :--- |
| `/encrypt` | `GET/POST` | Lock your text | `prompt` |
| `/cypher` | `POST` | Talk to Gemini | `encryptedPrompt` |
| `/decrypt` | `GET/POST` | Unlock the answer | `data` |

*Default Key: `jp1234`*

---

## 🎨 Design Aesthetic
Built with **Basic Pro Max** principles:
- **Typography**: Inter (Apple/Studio style)
- **Palette**: Pitch Black, Space Gray, and Electric Blue accents.
- **UX**: Zero clutter, pure focus.

## 📝 Detailed Usage Example (Step-by-Step)

If you have the server running, follow these steps to test it:

### Step 1: Encrypt a phrase
Go to your browser and visit:
`http://localhost:3000/encrypt?prompt=Open the pod bay doors`

**You'll get:**
```json
{ "encryptedPrompt": "U2FsdGVkX19..." }
```

### Step 2: Call the Model
Open Postman and send a **POST** request to `http://localhost:3000/cypher`:
**Body (raw JSON):**
```json
{ "encryptedPrompt": "PASTE_THE_CODE_FROM_STEP_1" }
```

**You'll get:**
```json
{ "encryptedResponse": "U2FsdGVkX19..." }
```

### Step 3: Decrypt the truth
Visit the decrypt link in your browser:
`http://localhost:3000/decrypt?data=PASTE_THE_CODE_FROM_STEP_2`

**Final Result:**
```json
{ "decryptedText": "I'm sorry, Dave. I'm afraid I can't do that." }
```

---

