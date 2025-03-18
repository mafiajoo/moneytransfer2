// Currency conversion rates
const rates = {
    USD: {
        EGP: 50.50,
        EUR: 0.91,
        GBP: 0.81,
        USD: 1 // USD to USD is 1
    },
    EGP: {
        USD: 1 / 50.50,
        EUR: 0.91 / 50.50,
        GBP: 0.81 / 50.50,
        EGP: 1 // EGP to EGP is 1
    },
    EUR: {
        USD: 1 / 0.91,
        EGP: 50.50 / 0.91,
        GBP: 0.81 / 0.91,
        EUR: 1 // EUR to EUR is 1
    },
    GBP: {
        USD: 1 / 0.81,
        EGP: 50.50 / 0.81,
        EUR: 0.91 / 0.81,
        GBP: 1 // GBP to GBP is 1
    }
};

// Function to calculate currency exchange
function calculateExchange() {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const conversionRate = rates[fromCurrency][toCurrency];
    const convertedAmount = amount * conversionRate;
    
    document.getElementById('exchange-result').innerText = `Converted Amount: ${convertedAmount.toFixed(2)} ${toCurrency}`;
}

// Function to initiate a money transfer (For simplicity, no backend interaction yet)
function initiateTransfer() {
    const fromCurrency = document.getElementById('transfer-from').value;
    const toCurrency = document.getElementById('transfer-to').value;
    const transferAmount = parseFloat(document.getElementById('transfer-amount').value);

    if (!transferAmount || isNaN(transferAmount) || transferAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    // Just a mock transfer, no real transactions happening here.
    document.getElementById('transfer-result').innerText = `You have transferred ${transferAmount} ${fromCurrency} to ${toCurrency}.`;
}
// Initialize Stripe with your public key (Replace with your own Stripe public key)
const stripe = Stripe("pk_live_51R3vLzHwauRcpoAGElnRu8aerdEaRdoxkn73AhCCaUHOhpO9VEfnvHBdoK28uBOwC8Lz8Tb47JyIKZxe2u1CdVGP00JkKz1LLh");

document.getElementById("payButton").addEventListener("click", function () {
    // Redirect to Stripe Checkout
    fetch("https://your-backend-url.com/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            currency: "usd",
            amount: 1000, // Example: $10.00
        }),
    })
    .then(response => response.json())
    .then(session => {
        return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .catch(error => console.error("Error:", error));
});
async function makePayment(amount, currency) {
    try {
        const response = await fetch("/.netlify/functions/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, currency }),
        });

        const data = await response.json();
        if (data.id) {
            window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
        } else {
            console.error("Payment failed:", data.error);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Example: Pay $10 USD
document.getElementById("payButton").addEventListener("click", function() {
    makePayment(10, "usd");
});

