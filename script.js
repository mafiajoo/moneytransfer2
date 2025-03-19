// Load Stripe
const stripe = Stripe("pk_live_YOUR_PUBLIC_KEY"); // Replace with your actual public key

// Function to Process Stripe Payment
async function processPayment() {
    let amount = parseFloat(document.getElementById("transfer-amount").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Invalid payment amount.");
        return;
    }

    try {
        let response = await fetch("/.netlify/functions/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amount * 100 }) // Convert to cents
        });

        let session = await response.json();
        console.log("Server response:", session); // ✅ Debugging Log

        if (!session.sessionId) {
            console.error("Error: No session ID returned from the server.", session);
            alert("Payment session failed. Please try again.");
            return;
        }

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({ sessionId: session.sessionId });

        if (result.error) {
            console.error("Stripe error:", result.error);
            alert("Payment failed. Please try again.");
        }
    } catch (error) {
        console.error("Error processing payment:", error);
        alert("Something went wrong. Please try again.");
    }
}

// Exchange Calculation
function calculateExchange() {
    let fromCurrency = document.getElementById("from-currency").value;
    let toCurrency = document.getElementById("to-currency").value;
    let amount = parseFloat(document.getElementById("amount").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    let exchangeRates = {
        "EGP": { "USD": 0.032, "EUR": 0.029, "GBP": 0.025 },
        "USD": { "EGP": 50.50, "EUR": 0.91, "GBP": 0.78 },
        "EUR": { "EGP": 55.22 , "USD": 1.1, "GBP": 0.86 },
        "GBP": { "EGP": 65.62, "USD": 1.28, "EUR": 1.16 }
    };

    if (fromCurrency === toCurrency) {
        document.getElementById("exchange-result").innerText = "Choose different currencies.";
        return;
    }

    let exchangedAmount = (amount * exchangeRates[fromCurrency][toCurrency]).toFixed(2);
    document.getElementById("exchange-result").innerText = `You will receive: ${exchangedAmount} ${toCurrency}`;
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
    payButton.style.display = "block";
}

// Ensure elements exist before adding event listeners
document.addEventListener("DOMContentLoaded", function () {
    let payButton = document.getElementById("payButton");
    if (payButton) {
        payButton.addEventListener("click", processPayment);
    }
});
