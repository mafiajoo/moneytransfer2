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

// Function to validate phone number (only digits, 7-15 characters)
function validatePhoneNumber(phone) {
    const phonePattern = /^[0-9]{7,15}$/;
    return phonePattern.test(phone);
}

// Function to initiate the money transfer
function initiateTransfer() {
    let fromCurrency = document.getElementById("transfer-from").value;
    let toCurrency = document.getElementById("transfer-to").value;
    let amount = parseFloat(document.getElementById("transfer-amount").value);

    let recipientName = document.getElementById("recipient-name").value;
    let recipientCountry = document.getElementById("recipient-country").value;
    let countryCode = document.getElementById("country-code").value;
    let recipientPhone = document.getElementById("recipient-phone").value;
    let recipientAccount = document.getElementById("recipient-account").value;

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

    if (!recipientName || !recipientCountry || !recipientPhone || !recipientAccount) {
        alert("Please fill in all recipient details.");
        return;
    }

    // Validate phone number
    if (!validatePhoneNumber(recipientPhone)) {
        alert("Invalid phone number. Please enter a valid number (7-15 digits).");
        return;
    }

    let fullPhoneNumber = `${countryCode}${recipientPhone}`; // Combine country code and number

    transferResult.innerHTML = `
        Transfer Initiated: ${amount} ${fromCurrency} to ${toCurrency} <br>
        Recipient: ${recipientName} <br>
        Country: ${recipientCountry} <br>
        Phone: ${fullPhoneNumber} <br>
        Bank Account: ${recipientAccount}
    `;

    // Show the "Pay Now" button after initiating transfer
    if (payButton) {
        payButton.style.display = "block";

        // Attach event listener to "Pay Now" button with correct parameters
        payButton.onclick = function () {
            processPayment(amount, fromCurrency);
        };
    }
}

// Ensure elements exist before adding event listeners
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");

    const transferButton = document.getElementById("transferButton");
    if (transferButton) {
        transferButton.addEventListener("click", initiateTransfer);
    }
});
