About WebCrypt
==============

Overview
--------

WebCrypt is a client-side file encryption application that utilizes the Web Crypto API to provide secure encryption and decryption of files using a private key. The application is built with JavaScript and runs entirely in the user's browser, ensuring that sensitive data never leaves the client-side.

Encryption Algorithm
--------------------

WebCrypt employs the AES-GCM (Advanced Encryption Standard - Galois/Counter Mode) encryption algorithm, which is a widely-used and secure symmetric-key cryptographic algorithm. The key used for encryption is derived from the user-provided private key using the PBKDF2 (Password-Based Key Derivation Function 2) algorithm with a random salt and 100,000 iterations.

Dependencies
------------

WebCrypt relies on the following dependencies:

*   **Web Crypto API**: A browser API that provides cryptographic primitives and utilities for performing various cryptographic operations, including key generation, encryption, and decryption.
*   **Bootstrap**: A free and open-source CSS framework directed at responsive, mobile-first front-end web development. It is Used for styling the UI.
*   **zxcvbn.js** An open-source password-strength-checking library. It is used to check the strength of the user's key for encryption and decryption.

Key Management
--------------

WebCrypt does not provide a built-in mechanism for key management or key exchange. The private key used for encryption and decryption must be provided by the user during each session. It is recommended to follow these best practices for secure key management:

*   Use a strong and unique private key for each encryption operation. Avoid reusing the same key for multiple files.
*   Keep your private key secure and never share it with untrusted parties.
*   Consider using a secure key management system or a hardware security module (HSM) for storing and managing private keys, especially in enterprise or high-security environments.
*   If you need to share encrypted files with others, establish a secure method for exchanging the private key, such as using a separate encrypted channel or a secure key exchange protocol.

Proper and Secure Usage
-----------------------

To ensure the security of your data when using WebCrypt, it is recommended to:

*   Use a strong and unique private key for each encryption operation.
*   Keep your private key secure and never share it with untrusted parties.
*   Verify the integrity of the downloaded encrypted or decrypted files before using them.
*   Use WebCrypt on a trusted and secure device and network.
*   Keep your WebCrypt installation up to date to benefit from the latest security updates and improvements.

Limitations
------------

While WebCrypt provides a secure client-side encryption solution, it's important to note the following limitations:

*   The security of the application relies heavily on the user's browser and the integrity of the JavaScript code.
*   The application does not provide any mechanisms for verifying the integrity or authenticity of the encrypted files.

Please note that WebCrypt is a proof-of-concept application and is not intended for production use. It is recommended to use a production-ready encryption solution for sensitive data protection.


License
--------

MIT License

Copyright (c) [2024] [Kieran Gannon]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.