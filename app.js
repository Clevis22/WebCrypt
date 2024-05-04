const fileInput = document.getElementById('fileInput');
const privateKeyInput = document.getElementById('privateKey');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const outputDiv = document.getElementById('output');
const selectedFileNameSpan = document.getElementById('selectedFileName');
const generateKeyBtn = document.getElementById('generateKeyBtn');

// Function to generate a secure random key
async function generateSecureKey() {
  const length = 32; // Key length in bytes
  const keyBuffer = new Uint8Array(length);
  const crypto = window.crypto || window.msCrypto; // For legacy Microsoft Edge support

  if (crypto) {
    await crypto.getRandomValues(keyBuffer);
    const keyHex = Array.from(keyBuffer)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
    return keyHex;
  } else {
    console.error('Web Crypto API is not supported in this browser.');
    return null;
  }
}

// Event listener for the generate key button
generateKeyBtn.addEventListener('click', async () => {
  const randomKey = await generateSecureKey();
  if (randomKey) {
    privateKeyInput.value = randomKey;
  } else {
    console.error('Failed to generate a secure random key.');
  }
});

const togglePasswordVisibility = document.getElementById('togglePasswordVisibility');
const passwordVisibilityIcon = document.getElementById('passwordVisibilityIcon');

togglePasswordVisibility.addEventListener('click', () => {
  const currentType = privateKeyInput.type;
  privateKeyInput.type = currentType === 'password' ? 'text' : 'password';
  passwordVisibilityIcon.classList.toggle('fa-eye');
  passwordVisibilityIcon.classList.toggle('fa-eye-slash');
});

// JavaScript for handling file selection and displaying file name
document.getElementById('dragAndDropBox').addEventListener('click', function() {
  document.getElementById('fileInput').click();
});

document.getElementById('dragAndDropBox').addEventListener('drop', function(event) {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files; // Set the files property of the FileInput element
    handleFile(files[0]);
  }
});

document.getElementById('dragAndDropBox').addEventListener('dragover', function(event) {
  event.preventDefault();
});

document.getElementById('fileInput').addEventListener('change', function() {
  const file = this.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (file) {
    selectedFileNameSpan.textContent = file.name; // Update the span with file name

    // Check if the file is encrypted and toggle button classes accordingly
    const isEncrypted = file.name.endsWith('.encrypted');
    toggleButtonClasses(isEncrypted);

    // Enable buttons
    encryptBtn.disabled = false;
    decryptBtn.disabled = false;
    showOutput('', '');
  } else {
    // Disable buttons if no file is selected
    encryptBtn.disabled = true;
    decryptBtn.disabled = true;
  }
}

// Add 'def' class to both buttons initially
encryptBtn.classList.add('def');
decryptBtn.classList.add('def');

// Event listeners for encrypt and decrypt buttons
encryptBtn.addEventListener('click', function() {
  const file = fileInput.files[0];
  encryptFile(file);
});

decryptBtn.addEventListener('click', function() {
  const file = fileInput.files[0];
  decryptFile(file);
});

async function encryptFile(file) {
  const privateKey = privateKeyInput.value;

  if (!file || !privateKey) {
    showOutput('Please select a file and provide a private key.', 'danger');
    return;
  }

  const fileBuffer = await readFileAsArrayBuffer(file);
  const encryptedData = await encryptWithKey(fileBuffer, privateKey);
  const encryptedBlob = new Blob([encryptedData], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(encryptedBlob);
  const link = createDownloadLink(url, `${file.name}.encrypted`, 'Download Encrypted File');
  showOutput(link, 'success');

  // Toggle button classes
  decryptBtn.classList.remove('btn-decrypt');
  encryptBtn.classList.remove('btn-encrypt');
  decryptBtn.classList.add('def');
  encryptBtn.classList.add('def');
}

async function decryptFile(file) {
  const privateKey = privateKeyInput.value;

  if (!file || !privateKey) {
    showOutput('Please select a file and provide a private key.', 'danger');
    return;
  }

  const fileBuffer = await readFileAsArrayBuffer(file);
  const decryptedData = await decryptWithKey(fileBuffer, privateKey);
  const decryptedBlob = new Blob([decryptedData], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(decryptedBlob);
  const link = createDownloadLink(url, `${file.name.replace(/\.encrypted$/, '')}`, 'Download Decrypted File');
  showOutput(link, 'success');

  // Toggle button classes
  toggleButtonClasses(false);
}

function toggleButtonClasses(isEncrypted) {
  if (isEncrypted) {
    decryptBtn.classList.remove('def');
    decryptBtn.classList.add('btn-decrypt');
    encryptBtn.classList.add('def');
  } else {
    encryptBtn.classList.remove('def');
    encryptBtn.classList.add('btn-encrypt');
    decryptBtn.classList.add('def');
  }
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

async function encryptWithKey(data, passphrase) {
  const encoder = new TextEncoder();
  const encodedPassphrase = encoder.encode(passphrase);

  const derivedKey = await window.crypto.subtle.importKey(
    'raw',
    encodedPassphrase,
    {
      name: 'PBKDF2',
    },
    false,
    ['deriveBits', 'deriveKey']
  );

  const salt = window.crypto.getRandomValues(new Uint8Array(16)); // Generate a random salt
  const keyMaterial = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    derivedKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt']
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    keyMaterial,
    data
  );

  const encryptedDataWithIV = new Uint8Array([...salt, ...iv, ...new Uint8Array(encryptedData)]);
  return encryptedDataWithIV;
}

async function decryptWithKey(data, passphrase) {
  try {
    console.log('Decrypting data with passphrase:', passphrase);
    console.log('Encrypted data:', data);

    const encoder = new TextEncoder();
    const encodedPassphrase = encoder.encode(passphrase);

    const derivedKey = await window.crypto.subtle.importKey(
      'raw',
      encodedPassphrase,
      {
        name: 'PBKDF2',
      },
      false,
      ['deriveBits', 'deriveKey']
    );

    const salt = data.slice(0, 16); // Extract salt from the encrypted data
    const iv = data.slice(16, 28); // Extract IV from the encrypted data
    const encryptedData = data.slice(28); // Extract encrypted data

    const keyMaterial = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      derivedKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['decrypt']
    );

    return await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      keyMaterial,
      encryptedData
    );
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Decryption failed');
  }
}


function createDownloadLink(url, fileName, linkText) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.innerText = linkText;
  return link;
}

function showOutput(content, type) {
  outputDiv.innerHTML = ''; // Clear existing content

  const outputElement = document.createElement('div');
  outputElement.classList.add(`alert`, `alert-${type}`);

  // Check if content is already a DOM node
  if (content instanceof Node) {
    outputElement.appendChild(content);
  } else {
    outputElement.textContent = content;
  }

  outputDiv.appendChild(outputElement);
}



