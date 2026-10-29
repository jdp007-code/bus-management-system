import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Constants
const ticketForm = document.getElementById('ticket-form');
const cardContainer = document.getElementById('ticket-card-container');
const PRICE_PER_PASSENGER = 50;

// QR Generator function
function generateQR(amount, note = '') {
  const upiID = '9157971522@ptsbi'; // Replace with your actual UPI ID
  const name = 'bpms'; // Display name

  const validAmount = parseFloat(amount);
  if (isNaN(validAmount) || validAmount <= 0) {
    alert("Invalid amount for QR generation.");
    return '';
  }

  const upiLink = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(name)}&am=${validAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink)}&size=200x200`;

  return `<p><strong>Scan to Pay:</strong></p><img src="${qrCodeUrl}" alt="UPI QR Code">`;
}

// Ticket Booking Event
ticketForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const route = document.getElementById('route').value.trim();
  const date = document.getElementById('date').value;
  const passengers = parseInt(document.getElementById('passengers').value);
  const paymentMethod = document.getElementById('payment-method').value;

  if (!name || !route || !date || isNaN(passengers) || passengers <= 0 || !paymentMethod) {
    alert('Please fill all the fields correctly.');
    return;
  }

  const totalPrice = passengers * PRICE_PER_PASSENGER;

  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      name,
      route,
      date,
      passengers,
      paymentMethod,
      totalPrice,
      bookedAt: serverTimestamp()
    });

    const qrHTML = generateQR(totalPrice, `Ticket for ${name} on ${route}, ${date} (${passengers} pax)`);

    cardContainer.innerHTML = `
      <div class="card" id="ticket-card" style="border: 1px solid #ccc; padding: 1rem; border-radius: 10px;">
        <h3>✅ Ticket Booked Successfully</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Route:</strong> ${route}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Passengers:</strong> ${passengers}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Total Price:</strong> ₹${totalPrice}</p>
        <p><em>Booking ID: ${docRef.id}</em></p>
        <div class="qr-block">${qrHTML}</div>
        <button id="download-ticket" style="margin-top: 10px;">Download Ticket</button>
      </div>
    `;

    // Wait for button to be added to DOM
    setTimeout(() => {
      const downloadBtn = document.getElementById('download-ticket');
      downloadBtn.addEventListener('click', () => {
        const ticketCard = document.getElementById('ticket-card');
        html2canvas(ticketCard).then(canvas => {
          const link = document.createElement('a');
          link.download = `ticket_${docRef.id}.png`;
          link.href = canvas.toDataURL();
          link.click();
        });
      });
    }, 100);

    ticketForm.reset();
  } catch (err) {
    console.error('Booking Error:', err.message);
    alert('❌ Failed to book ticket. Please try again.');
  }
});
