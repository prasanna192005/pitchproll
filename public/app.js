import { GoogleGenerativeAI } from "@google/generative-ai";
import { AES, Utf8 } from "crypto-es";

const GEMINI_API_KEY = "AIzaSyAL4GmcG7WcqqNfxJ_XWmXk3JmCRY6-Bwc";

// Main UI Elements
const hashedPromptInput = document.getElementById('hashedPrompt');
const secretKeyInput = document.getElementById('secretKey');
const processBtn = document.getElementById('processBtn');
const statusText = document.getElementById('status');
const resultArea = document.getElementById('resultArea');
const finalHashedResponse = document.getElementById('finalHashedResponse');
const copyBtn = document.getElementById('copyBtn');

// Encoder UI Elements
const encoderCard = document.getElementById('encoderCard');
const toggleEncoder = document.getElementById('toggleEncoder');
const plainTextInput = document.getElementById('plainTextToEncrypt');
const encryptBtn = document.getElementById('encryptBtn');

function setStatus(msg, isError = false) {
    statusText.innerText = msg;
    statusText.style.color = isError ? '#ff4d4d' : '#86868b';
}

// ==========================================
// ENCODER LOGIC (Generate the Cipher)
// ==========================================
encryptBtn.addEventListener('click', () => {
    const text = plainTextInput.value.trim();
    const key = secretKeyInput.value.trim();

    if (!text || !key) {
        alert("Enter both plaintext and key to encrypt.");
        return;
    }

    const encrypted = AES.encrypt(text, key, { iterations: 1 }).toString();
    hashedPromptInput.value = encrypted;
    encoderCard.classList.add('hidden');
    toggleEncoder.innerText = "Open Encoder";
    setStatus("Cipher generated and loaded.");
});

toggleEncoder.addEventListener('click', () => {
    const isHidden = encoderCard.classList.contains('hidden');
    encoderCard.classList.toggle('hidden');
    toggleEncoder.innerText = isHidden ? "Close Encoder" : "Open Encoder";
});

// ==========================================
// MAIN PROCESSING LOGIC
// ==========================================
async function runCipher() {
    const hashedPrompt = hashedPromptInput.value.trim();
    const secretKey = secretKeyInput.value.trim();

    if (!hashedPrompt || !secretKey) {
        setStatus("Missing input or key", true);
        return;
    }

    try {
        processBtn.disabled = true;
        resultArea.classList.add('hidden');
        setStatus("Decrypting...");

        // 1. Decrypt using crypto-es
        let decryptedPrompt;
        try {
            const bytes = AES.decrypt(hashedPrompt, secretKey, { iterations: 1 });
            decryptedPrompt = bytes.toString(Utf8);
            if (!decryptedPrompt) throw new Error();
        } catch (e) {
            throw new Error("Decryption failed (Check key)");
        }

        // 2. AI Request
        setStatus("Generating response...");
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const result = await model.generateContent(decryptedPrompt);
        const response = await result.response;
        const text = response.text();

        // 3. Encrypt back
        setStatus("Encrypting response...");
        const encryptedResponse = AES.encrypt(text, secretKey, { iterations: 1 }).toString();
        
        finalHashedResponse.value = encryptedResponse;
        resultArea.classList.remove('hidden');
        setStatus("Complete");

    } catch (err) {
        setStatus(err.message, true);
        console.error(err);
    } finally {
        processBtn.disabled = false;
    }
}

processBtn.addEventListener('click', runCipher);

copyBtn.addEventListener('click', () => {
    finalHashedResponse.select();
    document.execCommand('copy');
    const originalText = copyBtn.innerText;
    copyBtn.innerText = 'COPIED';
    setTimeout(() => copyBtn.innerText = originalText, 2000);
});
