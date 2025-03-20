// Load Stripe
const stripe = Stripe("pk_live_YOUR_PUBLIC_KEY"); // Replace with your real Stripe public key

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

// Country-specific phone number validation
const countryPhoneFormats = {
    "EGP": /^\+20\d{10}$/, // Egypt (e.g., +201095427265)
    "USA": /^\+1\d{10}$/,  // USA
    "DE": /^\+49\d{10,11}$/,  // Germany
    "FR": /^\+33\d{9}$/,  // France
    "IT": /^\+39\d{9,10}$/,  // Italy
    "ES": /^\+34\d{9}$/,  // Spain
    "PL": /^\+48\d{9}$/,  // Poland
    "GB": /^\+44\d{10}$/,  // United Kingdom
    "SE": /^\+46\d{9}$/,  // Sweden
    "NO": /^\+47\d{8,9}$/,  // Norway
    "FI": /^\+358\d{9}$/, // Finland
    "NL": /^\+31\d{9}$/   // Netherlands
};

// Function to validate phone number based on the selected country
function validatePhoneNumber(phone, countryCode) {
    if (countryPhoneFormats[countryCode]) {
        return countryPhoneFormats[countryCode].test(phone);
    }
    return false;
}

// Function to calculate exchange rate (mock example)
function calculateExchange() {
    let fromCurrency = document.getElementById("from-currency").value;
    let toCurrency = document.getElementById("to-currency").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let exchangeResult = document.getElementById("exchange-result");

    if (isNaN(amount) || amount <= 0) {
        exchangeResult.innerHTML = "Please enter a valid amount.";
        return;
    }

    let exchangeRates = {
        "EGP": { "USD": 0.02, "EUR": 0.029, "GBP": 0.025 },
        "USD": { "EGP": 50.65, "EUR": 0.91, "GBP": 0.78 },
        "EUR": { "EGP": 55.26, "USD": 1.1, "GBP": 0.86 },
        "GBP": { "EGP": 65.88, "USD": 1.28, "EUR": 1.16 }
    };

    if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
        let convertedAmount = amount * exchangeRates[fromCurrency][toCurrency];
        exchangeResult.innerHTML = `Converted Amount: ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } else {
        exchangeResult.innerHTML = "Exchange rate not available.";
    }
}

// Function to initiate money transfer and process payment
function initiateTransfer() {
    let fromCurrency = document.getElementById("transfer-from").value;
    let toCurrency = document.getElementById("transfer-to").value;
    let amount = parseFloat(document.getElementById("transfer-amount").value);

    let recipientName = document.getElementById("recipient-name").value;
    let recipientCountry = document.getElementById("recipient-country").value;
    let recipientPhone = document.getElementById("recipient-phone").value;
    let recipientAccount = document.getElementById("recipient-account").value;

    let transferResult = document.getElementById("transfer-result");

    if (isNaN(amount) || amount <= 0) {
        alert("Enter a valid transfer amount.");
        return;
    }

    if (!recipientName || !recipientCountry || !recipientPhone || !recipientAccount) {
        alert("Please fill in all recipient details.");
        return;
    }

    if (!validatePhoneNumber(recipientPhone, recipientCountry)) {
        alert("Invalid phone number format for the selected country.");
        return;
    }

    transferResult.innerHTML = `Transfer Initiated: ${amount} ${fromCurrency} to ${toCurrency} <br>
        Recipient: ${recipientName} <br>
        Country: ${recipientCountry} <br>
        Phone: ${recipientPhone} <br>
        Bank Account: ${recipientAccount}`;

    // Automatically initiate the payment
    processPayment(amount, fromCurrency);
}

// Attach event listener to the Initiate Transfer button
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("transferButton").addEventListener("click", initiateTransfer);
});

    const countrySelect = document.getElementById("recipient-country");
    const phoneInput = document.getElementById("recipient-phone");

    // Handle country selection change
    countrySelect.addEventListener("change", function () {
        const selectedCountry = countrySelect.value;

        // Clear the phone input if no valid country is selected
        if (!selectedCountry) {
            phoneInput.value = "";
            return;
        }

        // Prefill phone number with country code
        if (countryPhoneFormats[selectedCountry]) {
            phoneInput.value = countryPhoneFormats[selectedCountry].source.match(/\+\d+/)[0]; // Extract country code
        }
    });
});

