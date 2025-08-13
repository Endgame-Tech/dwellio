// generateSecret.js
const crypto = require('crypto');

// Generate a 64-byte random string, then convert to hex
// This will result in a 128-character hex string, which is very strong.
// You can adjust the number of bytes (e.g., 32 bytes for a 64-char string).
const secret = crypto.randomBytes(64).toString('hex');

console.log('Your new JWT Secret:');
console.log(secret);