// Load Stripe
const stripe = Stripe("your-stripe-public-key-here");

// Ensure the script runs after DOM loads
document.addEventListener("DOMContentLoaded", function () {
    let transferButton = document.getElementById("initiateTransfer");
    let payButton = document.getElementById("payButton");

    // Check if the buttons exist before adding event listeners
    if (transferButton) {
        transferButton.addEventListener("click", initiateTransfer);
    } else {
        console.error("Error: transferButton not found in DOM");
    }

    if (payButton) {
        payButton.addEventListener("click", processPayment);
    } else {
        console.error("Error: payButton not found in DOM");
    }
});

// Exchange Calculation
function calculateExchange() {
    let fromCurrency = document.getElementById("from-currency").value;
    let toCurrency = document.getElementById("to-currency").value;
    let amount = document.getElementById("amount").value;

    if (amount <= 0) {
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
    let amount = document.getElementById("transfer-amount").value;
    let transferResult = document.getElementById("transfer-result");
    let payButton = document.getElementById("payButton");

    if (amount <= 0) {
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

// Function to Process Stripe Payment
async function processPayment() {
    let amount = document.getElementById("transfer-amount").value;

    if (amount <= 0) {
        alert("Invalid payment amount.");
        return;
    }

    try {
        // Simulating payment request (must have a backend)
        let response = await fetch("/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amount * 100 }) // Convert to cents for Stripe
        });

        let session = await response.json();

        if (!session.id) {
            console.error("Error: No session ID returned from the server.");
            alert("Payment session failed. Please try again.");
            return;
        }

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) {
            console.error("Stripe error:", result.error);
            alert("Payment failed. Please try again.");
        }
    } catch (error) {
        console.error("Error processing payment:", error);
        alert("Something went wrong. Please try again.");
    }
}
