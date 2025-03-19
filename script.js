// Load Stripe
const stripe = Stripe("your-stripe-public-key-here");

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
        "USD": { "EGP": 31.25, "EUR": 0.91, "GBP": 0.78 },
        "EUR": { "EGP": 34.48, "USD": 1.1, "GBP": 0.86 },
        "GBP": { "EGP": 40.00, "USD": 1.28, "EUR": 1.16 }
    };

    if (fromCurrency === toCurrency) {
        document.getElementById("exchange-result").innerText = "Choose different currencies.";
        return;
    }

    let exchangedAmount = (amount * exchangeRates[fromCurrency][toCurrency]).toFixed(2);
    document.getElementById("exchange-result").innerText = `You will receive: ${exchangedAmount} ${toCurrency}`;
}

// Money Transfer Function (Move to Global Scope)
window.initiateTransfer = function () {
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
};

// Stripe Payment Function
document.getElementById("payButton").addEventListener("click", async function () {
    let amount = document.getElementById("transfer-amount").value;

    if (amount <= 0) {
        alert("Invalid payment amount.");
        return;
    }

    // Simulating payment request (normally, you need a backend to create a payment session)
    let response = await fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }) // Convert to cents for Stripe
    });

    let session = await response.json();

    // Redirect to Stripe Checkout
    stripe.redirectToCheckout({ sessionId: session.id });
});
