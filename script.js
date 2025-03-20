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
    "EGP": /^\+20\d{10}$/, 
    "USA": /^\+1\d{10}$/,  
    "DE": /^\+49\d{10,11}$/,  
    "FR": /^\+33\d{9}$/,  
    "IT": /^\+39\d{9,10}$/,  
    "ES": /^\+34\d{9}$/,  
    "PL": /^\+48\d{9}$/,  
    "GB": /^\+44\d{10}$/,  
    "SE": /^\+46\d{9}$/,  
    "NO": /^\+47\d{8,9}$/,  
    "FI": /^\+358\d{9}$/, 
    "NL": /^\+31\d{9}$/   
};

// Function to validate phone number
function validatePhoneNumber(phone, countryCode) {
    return countryPhoneFormats[countryCode]?.test(phone) || false;
}

// Function to calculate exchange rate
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

// Function to initiate money transfer
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

    transferResult.innerHTML = `✅ Transfer Initiated: ${amount} ${fromCurrency} to ${toCurrency} <br>
        👤 Recipient: ${recipientName} <br>
        🌍 Country: ${recipientCountry} <br>
        📞 Phone: ${recipientPhone} <br>
        🏦 Bank Account: ${recipientAccount}`;

    // Confirm before proceeding with payment
    let confirmPayment = confirm("Transfer successful! Do you want to proceed with the payment?");
    if (confirmPayment) {
        processPayment(amount, fromCurrency);
    }
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", function () {
    const transferForm = document.getElementById("transfer-form");
    const transferButton = document.getElementById("transfer-button");
    const countrySelect = document.getElementById("recipient-country");
    const phoneInput = document.getElementById("recipient-phone");

    if (transferForm) {
        transferForm.addEventListener("input", function () {
            let recipientCountry = document.getElementById("recipient-country").value;
            let transferAmount = document.getElementById("transfer-amount").value.trim();
            let recipientName = document.getElementById("recipient-name").value.trim();
            let recipientAccount = document.getElementById("recipient-account").value.trim();
            let transferNote = document.getElementById("transfer-note");

            let europeanCountries = ["DE", "FR", "IT", "ES", "PL", "GB", "SE", "NO", "FI", "NL"];
            if (europeanCountries.includes(recipientCountry) && transferAmount && recipientName && recipientAccount) {
                transferNote.style.display = "block";
            } else {
                transferNote.style.display = "none";
            }
        });
    }

    if (countrySelect && phoneInput) {
        countrySelect.addEventListener("change", function () {
            const selectedCountry = countrySelect.value;

            if (!selectedCountry) {
                phoneInput.value = "";
                return;
            }

            if (countryPhoneFormats[selectedCountry]) {
                phoneInput.value = countryPhoneFormats[selectedCountry].source.match(/\+\d+/)[0];
            }
        });
    }

    if (transferButton) {
        transferButton.addEventListener("click", function (event) {
            event.preventDefault();
            initiateTransfer();
        });
    } else {
        console.error("❌ Error: 'transfer-button' not found in the DOM.");
    }
});
