//merge 0
// 'use strict';

let crypto;
try {
    crypto = require('crypto');
} catch (err) {
    console.log('crypto support is disabled!');
}
const ALGORITHM = process.env.REACT_APP_ENCRYPT_METHOD;
const CIPHER_KEY = process.env.REACT_APP_CIPHER_KEY;
const BLOCK_SIZE = 16;

export default {

    // Decrypts cipher text into plain text
    Decrypt: function decrypt(cipherText) {
        const contents = Buffer.from(cipherText, 'hex');
        const iv = contents.slice(0, BLOCK_SIZE);
        const textBytes = contents.slice(BLOCK_SIZE);

        const decipher = crypto.createDecipheriv(ALGORITHM, CIPHER_KEY, iv);
        let decrypted = decipher.update(textBytes, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    },

    // Encrypts plain text into cipher text
    Encrypt: function encrypt(plainText) {
        const iv = crypto.randomBytes(BLOCK_SIZE);
        const cipher = crypto.createCipheriv(ALGORITHM, CIPHER_KEY, iv);
        let cipherText;
        try {
            cipherText = cipher.update(plainText, 'utf8', 'hex');
            cipherText += cipher.final('hex');
            cipherText = iv.toString('hex') + cipherText
        } catch (e) {
            cipherText = null;
        }
        return cipherText;
    }
}