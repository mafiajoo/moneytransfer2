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

// Function to validate phone number (only digits, 7-15 characters long)
function validatePhoneNumber(phone) {
    return /^[0-9]{7,15}$/.test(phone);
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
        "EGP": { "USD": 0.032, "EUR": 0.029, "GBP": 0.025 },
        "USD": { "EGP": 31.25, "EUR": 0.91, "GBP": 0.78 },
        "EUR": { "EGP": 34.48, "USD": 1.1, "GBP": 0.86 },
        "GBP": { "EGP": 40.00, "USD": 1.28, "EUR": 1.16 }
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
    let payButton = document.getElementById("payButton");

    if (isNaN(amount) || amount <= 0) {
        alert("Enter a valid transfer amount.");
        return;
    }

    if (!recipientName || !recipientCountry || !recipientPhone || !recipientAccount) {
        alert("Please fill in all recipient details.");
        return;
    }

    if (!validatePhoneNumber(recipientPhone)) {
        alert("Invalid phone number (7-15 digits only).");
        return;
    }

    transferResult.innerHTML = `Transfer Initiated: ${amount} ${fromCurrency} to ${toCurrency} <br>
        Recipient: ${recipientName} <br>
        Country: ${recipientCountry} <br>
        Phone: ${recipientPhone} <br>
        Bank Account: ${recipientAccount}`;

    if (payButton) {
        payButton.style.display = "block";
        payButton.onclick = function () {
            processPayment(amount, fromCurrency);
        };
    }
}

// Function to send support message
async function sendSupportMessage() {
    let name = document.getElementById("support-name").value;
    let email = document.getElementById("support-email").value;
    let phone = document.getElementById("support-phone").value;
    let message = document.getElementById("support-message").value;
    let supportResult = document.getElementById("support-result");

    if (!name || !email || !phone || !message) {
        alert("Please fill in all fields.");
        return;
    }

    let emailBody = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`;

    try {
        const response = await fetch("https://formspree.io/f/xblgdazj", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "egyptsupplies100@gmail.com", message: emailBody })
        });

        if (response.ok) {
            supportResult.innerHTML = "Message sent successfully!";
        } else {
            supportResult.innerHTML = "Failed to send message.";
        }
    } catch (error) {
        supportResult.innerHTML = "Error sending message.";
    }
}

// Modal login and register functionality
const modal = document.getElementById("auth-modal");
const closeModal = document.getElementById("close-modal");
const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");
const authButton = document.getElementById("auth-button");
const authError = document.getElementById("auth-error");

loginLink.onclick = function () {
    modal.style.display = "block";
    document.getElementById("modal-title").innerText = "Login";
    authButton.innerText = "Login";
    authButton.onclick = login;
};

registerLink.onclick = function () {
    modal.style.display = "block";
    document.getElementById("modal-title").innerText = "Register";
    authButton.innerText = "Register";
    authButton.onclick = register;
};

closeModal.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function login(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Simple check (replace with real authentication logic later)
    if (username === "user" && password === "password") {
        alert("Login successful");
        modal.style.display = "none";
    } else {
        authError.style.display = "block";
    }
}

function register(event) {
    event.preventDefault();
    alert("Registration feature coming soon!");
    modal.style.display = "none";
}
