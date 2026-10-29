import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Handle form logic
const formTypeSelect = document.getElementById('form-type');
const createFields = document.getElementById('create-fields');
const renewFields = document.getElementById('renew-fields');
const form = document.getElementById('bus-pass-form');
const qrContainer = document.createElement("div");
qrContainer.className = "qr-container";
form.after(qrContainer);

formTypeSelect.addEventListener('change', () => {
  const selected = formTypeSelect.value;
  createFields.style.display = selected === 'create' ? 'block' : 'none';
  renewFields.style.display = selected === 'renew' ? 'block' : 'none';
});

// QR Generator
function generateQR(amount, note = '') {
  const upiID = '9157971522@ptsbi'; // Your UPI ID
  const name = 'bus management system'; // Payee Name

  const validAmount = parseFloat(amount);
  if (isNaN(validAmount) || validAmount <= 0) {
    alert("Invalid amount for QR generation.");
    return;
  }

  const upiLink = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(name)}&am=${validAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink)}&size=200x200`;

  qrContainer.innerHTML = `<p>Scan to Pay ₹${validAmount.toFixed(2)}</p><img src="${qrCodeUrl}" alt="UPI QR Code">`;
}
// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const type = formTypeSelect.value;

  if (type === 'create') {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const duration = parseInt(document.getElementById('create-duration').value);
    const amount = duration * 10; // Rs.10/day logic

    try {
      const docRef = await addDoc(collection(db, "bus_passes"), {
        name, email, duration, createdAt: serverTimestamp(), amount
      });
      generateQR(amount, `Bus pass of ${duration} days (ID: ${docRef.id})`);
      alert(`Pass Created. Pay ₹${amount}. QR code generated.`);
    } catch (err) {
      alert("Error: " + err.message);
    }

  } else if (type === 'renew') {
    const passId = document.getElementById('pass-id').value;
    const newDuration = parseInt(document.getElementById('renew-duration').value);
    const amount = newDuration * 10;

    try {
      await addDoc(collection(db, "renewals"), {
        passId, newDuration, renewedAt: serverTimestamp(), amount
      });
      generateQR(`Pay ₹${amount} to renew pass ID: ${passId} for ${newDuration} days`);
      alert(`Pass renewal requested. Pay ₹${amount}. QR code generated.`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  }
});
