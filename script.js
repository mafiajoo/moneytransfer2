// Load Stripe
const stripe = Stripe("pk_live_YOUR_PUBLIC_KEY"); // Replace with your actual public key

// Function to Process Stripe Payment
async function processPayment(amount, currency) {
    console.log("Processing payment for amount:", amount, currency);

    try {
        const response = await fetch('/.netlify/functions/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Payment session:", data);

        // ✅ Redirect user to Stripe checkout
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error("No session URL returned from Stripe");
        }

    } catch (error) {
        console.error("Error processing payment:", error);
        alert("Something went wrong: " + error.message);
    }
}

// Currency Conversion Rates
const rates = {
    USD: { EGP: 50.50, EUR: 0.91, GBP: 0.81, USD: 1 },
    EGP: { USD: 1 / 50.50, EUR: 0.91 / 50.50, GBP: 0.81 / 50.50, EGP: 1 },
    EUR: { USD: 1 / 0.91, EGP: 50.50 / 0.91, GBP: 0.81 / 0.91, EUR: 1 },
    GBP: { USD: 1 / 0.81, EGP: 50.50 / 0.81, EUR: 0.91 / 0.81, GBP: 1 }
};

// Function to Calculate Currency Exchange
function calculateExchange() {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    if (fromCurrency === toCurrency) {
        document.getElementById("exchange-result").innerText = "Choose different currencies.";
        return;
    }

    const conversionRate = rates[fromCurrency][toCurrency];
    const convertedAmount = (amount * conversionRate).toFixed(2);
    
    document.getElementById("exchange-result").innerText = `You will receive: ${convertedAmount} ${toCurrency}`;
}

// Money Transfer Function
function initiateTransfer() {
    let fromCurrency = document.getElementById("transfer-from").value;
    let toCurrency = document.getElementById("transfer-to").value;
    let amount = parseFloat(document.getElementById("transfer-amount").value);
    let transferResult = document.getElementById("transfer-result");
    let payButton = document.getElementById("payButton"); 

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid transfer amount.");
        return;
    }

    if (fromCurrency === toCurrency) {
        transferResult.innerText = "Cannot transfer to the same currency.";
        return;
    }

    transferResult.innerText = `Transfer Initiated: ${amount} ${fromCurrency} to ${toCurrency}`;
    
    // Show the "Pay Now" button after initiating transfer
    if (payButton) {
        payButton.style.display = "block";

        // Attach event listener with correct parameters
        payButton.onclick = function () {
            processPayment(amount, fromCurrency);
        };
    }
}

// Ensure elements exist before adding event listeners
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");

    if (typeof Stripe === "undefined") {
        console.error("Stripe.js is not loaded. Check your HTML.");
        alert("Payment system error: Stripe is not loaded.");
        return;
    }

    console.log("Stripe is loaded");

    const transferButton = document.getElementById("transferButton");

    if (transferButton) {
        transferButton.addEventListener("click", initiateTransfer);
    }
});
