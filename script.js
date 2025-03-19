<<<<<<< HEAD
<<<<<<< HEAD
// Load Stripe
const stripe = Stripe("pk_live_YOUR_PUBLIC_KEY"); // Replace with your actual public key

// Function to Process Stripe Payment
async function processPayment() {
    let amount = parseFloat(document.getElementById("transfer-amount").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Invalid payment amount.");
        return;
    }

    if (amount > 999999.99) {
        alert("The maximum allowed payment is $999,999.99. Please enter a smaller amount.");
        return;
    }

    try {
        console.log("Processing payment for amount:", amount);

  let response = await fetch("https://moneyexchange.netlify.app/.netlify/functions/create-checkout-session", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amount * 100 }) // Convert to cents
        });

        console.log("HTTP Response Status:", response.status);

        if (!response.ok) {
            let errorText = await response.text(); // Get error details
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        let session = await response.json();

        console.log("Session response:", session); // Debugging log

        if (!session.sessionId) {
            console.error("Error: No session ID returned from the server.", session);
            alert("Payment session failed. Please try again.");
            return;
        }

        await stripe.redirectToCheckout({ sessionId: session.sessionId });
    } catch (error) {
        console.error("Error processing payment:", error); // Now logs real error details
        alert("Something went wrong: " + error.message);  // Show error in alert
    }
}

// Exchange Calculation
function calculateExchange() {
    let fromCurrency = document.getElementById("from-currency").value;
    let toCurrency = document.getElementById("to-currency").value;
    let amount = parseFloat(document.getElementById("amount").value);

    if (isNaN(amount) || amount <= 0) {
=======
=======
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
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
<<<<<<< HEAD
>>>>>>> 7d5042e (Updated files with new features)
=======
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
        alert("Please enter a valid amount.");
        return;
    }

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
    const conversionRate = rates[fromCurrency][toCurrency];
    const convertedAmount = amount * conversionRate;
    
    document.getElementById('exchange-result').innerText = `Converted Amount: ${convertedAmount.toFixed(2)} ${toCurrency}`;
}

<<<<<<< HEAD
// Function to initiate a money transfer
=======
// Function to initiate a money transfer (For simplicity, no backend interaction yet)
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
function initiateTransfer() {
    const fromCurrency = document.getElementById('transfer-from').value;
    const toCurrency = document.getElementById('transfer-to').value;
    const transferAmount = parseFloat(document.getElementById('transfer-amount').value);

    if (!transferAmount || isNaN(transferAmount) || transferAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

<<<<<<< HEAD
    // Display the transfer details
    document.getElementById('transfer-result').innerText = `You have transferred ${transferAmount} ${fromCurrency} to ${toCurrency}.`;

    // Show the "Pay Now" button after a successful transfer
    setTimeout(() => {
        document.getElementById("payNowButton").style.display = "block";
    }, 2000);
=======
    document.getElementById('transfer-result').innerText = `You have transferred ${transferAmount} ${fromCurrency} to ${toCurrency}.`;
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
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

<<<<<<< HEAD
    const payButton = document.getElementById("payNowButton");
=======
    const payButton = document.getElementById("payButton");
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135

    if (!payButton) {
        console.error("Pay button not found");
        alert("Error: Pay button not found in the HTML.");
        return;
    }

    payButton.addEventListener("click", async function () {
        console.log("Pay button clicked");

<<<<<<< HEAD
        const transferAmount = parseFloat(document.getElementById("transfer-amount").value);

        if (!transferAmount || isNaN(transferAmount) || transferAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

=======
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
        try {
            const response = await fetch("/.netlify/functions/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
                body: JSON.stringify({ amount: transferAmount * 100, currency: "usd" }) // Convert to cents
=======
                body: JSON.stringify({ amount: 1000, currency: "usd" }) 
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
            });

            const data = await response.json();
            console.log("Received response:", data);

            if (data.id) {
                console.log("Redirecting to checkout...");
                await stripe.redirectToCheckout({ sessionId: data.id });
            } else {
                console.error("Payment failed:", data.error);
                alert("Payment failed: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while processing your payment.");
        }
    });
<<<<<<< HEAD
>>>>>>> 7d5042e (Updated files with new features)
=======
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
});
