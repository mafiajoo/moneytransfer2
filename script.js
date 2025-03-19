// Currency conversion rates
const rates = {
    USD: { EGP: 50.50, EUR: 0.91, GBP: 0.81, USD: 1 },
    EGP: { USD: 1 / 50.50, EUR: 0.91 / 50.50, GBP: 0.81 / 50.50, EGP: 1 },
    EUR: { USD: 1 / 0.91, EGP: 50.50 / 0.91, GBP: 0.81 / 0.91, EUR: 1 },
    GBP: { USD: 1 / 0.81, EGP: 50.50 / 0.81, EUR: 0.91 / 0.81, GBP: 1 }
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

// Function to initiate a money transfer
function initiateTransfer() {
    const fromCurrency = document.getElementById('transfer-from').value;
    const toCurrency = document.getElementById('transfer-to').value;
    const transferAmount = parseFloat(document.getElementById('transfer-amount').value);

    if (!transferAmount || isNaN(transferAmount) || transferAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    // Store transfer amount in local storage to use for payment
    localStorage.setItem("transferAmount", transferAmount);

    // Show Pay Now button
    document.getElementById("payButton").style.display = "block";

    document.getElementById('transfer-result').innerText = `You have transferred ${transferAmount} ${fromCurrency} to ${toCurrency}. Now proceed to payment.`;
}

// Ensure the DOM is fully loaded before using Stripe
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");

    if (typeof Stripe === "undefined") {
        console.error("Stripe.js is not loaded. Check your HTML.");
        alert("Payment system error: Stripe is not loaded.");
        return;
    }

    console.log("Stripe is loaded");

    const stripe = Stripe("pk_live_51R3vLzHwauRcpoAGElnRu8aerdEaRdoxkn73AhCCaUHOhpO9VEfnvHBdoK28uBOwC8Lz8Tb47JyIKZxe2u1CdVGP00JkKz1LLh");
    const payButton = document.getElementById("payButton");

    if (!payButton) {
        console.error("Pay button not found");
        alert("Error: Pay button not found in the HTML.");
        return;
    }

    payButton.addEventListener("click", async function () {
        console.log("Pay button clicked");

        const transferAmount = parseFloat(localStorage.getItem("transferAmount"));

        if (!transferAmount || isNaN(transferAmount) || transferAmount <= 0) {
            alert("Please enter a valid transfer amount before paying.");
            return;
        }

        try {
            const response = await fetch("/.netlify/functions/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: transferAmount * 100, currency: "usd" }) // Convert to cents
            });

            const data = await response.json();
            console.log("Received response:", data); // Log full response

            if (data.sessionId) { // Correct key name
                console.log("Redirecting to checkout...");
                await stripe.redirectToCheckout({ sessionId: data.sessionId });
            } else {
                console.error("Payment failed:", data.error);
                alert("Payment failed: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while processing your payment.");
        }
    });
});

