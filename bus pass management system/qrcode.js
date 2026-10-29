const paymentSection = document.getElementById("payment-section");
const qrCodeContainer = document.getElementById("qrcode");
qrCodeContainer.innerHTML = ""; // clear previous QR if any

// This is the data to encode in the QR code
const paymentDetails = `Payment for: ${name}, Duration: ${duration} days, Amount: ₹${amount}`;

// Generate QR
new QRCode(qrCodeContainer, {
    text: paymentDetails,
    width: 200,
    height: 200
});

// Show the payment section
paymentSection.style.display = "block";
