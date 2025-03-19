// Load Stripe
const stripe = Stripe("pk_live_YOUR_PUBLIC_KEY"); // Replace with your real Stripe public key

// Function to fetch and display live currency rates
async function fetchCurrencyRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EGP');
        const data = await response.json();

        const currencies = ["USD", "EUR", "GBP", "EGP"];
        const tableBody = document.querySelector("#currency-table tbody");
        tableBody.innerHTML = "";

        currencies.forEach(currency => {
            if (data.rates[currency]) {
                let row = `<tr><td>${currency}</td><td>${data.rates[currency].toFixed(2)}</td></tr>`;
                tableBody.innerHTML += row;
            }
        });
    } catch (error) {
        console.error("Error fetching currency rates:", error);
    }
}

// Fetch currency rates every 30 seconds
setInterval(fetchCurrencyRates, 30000);
fetchCurrencyRates(); // Run on page load

// Function to process payments via Stripe
async function processPayment(amount, currency) {
    try {
        const response = await fetch('/.netlify/functions/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency })
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error("No session URL returned from Stripe");
        }
    } catch (error) {
        alert("Payment error: " + error.message);
    }
}

// Function to validate phone number
function validatePhoneNumber(phone) {
    return /^[0-9]{7,15}$/.test(phone);
}

// Function to initiate money transfer
function initiateTransfer() {
    let countryCode = document.getElementById("country-code").value;
    let recipientPhone = document.getElementById("recipient-phone").value;

    if (!validatePhoneNumber(recipientPhone)) {
        alert("Invalid phone number (7-15 digits only).");
        return;
    }

    let fullPhoneNumber = `${countryCode}${recipientPhone}`;
    document.getElementById("transfer-result").innerHTML = `Transfer Initiated. Phone: ${fullPhoneNumber}`;
}

// Attach event listeners after DOM loads
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("transferButton").addEventListener("click", initiateTransfer);
});
