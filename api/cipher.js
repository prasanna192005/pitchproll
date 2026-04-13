const CryptoJS = require('crypto-js');

/**
 * Modular AES-256 Encryption Utility
 * Standardized for cross-platform compatibility (iterations: 1)
 */

function encrypt(text, key) {
    if (!text) return null;
    return CryptoJS.AES.encrypt(text, key, { iterations: 1 }).toString();
}

function decrypt(cipher, key) {
    if (!cipher) return null;
    
    // Fix common shell-mangling (spaces to pluses)
    const sanitizedCipher = cipher.replace(/ /g, '+');
    
    try {
        const bytes = CryptoJS.AES.decrypt(sanitizedCipher, key, { iterations: 1 });
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedText || null;
    } catch (e) {
        return null;
    }
}

module.exports = {
    encrypt,
    decrypt
};
