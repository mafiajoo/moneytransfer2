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
            supportResult.innerHTML = "Your message has been sent successfully!";
        } else {
            throw new Error("Failed to send message.");
        }
    } catch (error) {
        supportResult.innerHTML = "Error sending message. Please try again.";
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
    let storedUsername = localStorage.getItem("username");
    let storedPassword = localStorage.getItem("password");

    if (username === storedUsername && password === storedPassword) {
        alert("Login successful");
        modal.style.display = "none";
    } else {
        authError.style.display = "block";
    }
}

function register(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username && password) {
        // Store the username and password in local storage (for simulation)
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);

        alert("Registration successful!");
        modal.style.display = "none";
    } else {
        alert("Please fill in all fields.");
    }
}

// Language Data
const translations = {
    en: {
        "page-title": "Money Transfer and Currency Exchange",
        "currency-exchange-heading": "Currency Exchange",
        "money-transfer-heading": "Money Transfer",
        "payment-heading": "Make a Payment",
        "payment-description": "Pay securely using Stripe.",
        "support-heading": "Support",
        "modal-title": "Login",
        "login-button": "Login",
        "register-button": "Register"
    },
    de: {
        "page-title": "Geldtransfer und Währungsumtausch",
        "currency-exchange-heading": "Währungsumtausch",
        "money-transfer-heading": "Geldtransfer",
        "payment-heading": "Zahlung tätigen",
        "payment-description": "Zahlen Sie sicher mit Stripe.",
        "support-heading": "Unterstützung",
        "modal-title": "Anmelden",
        "login-button": "Anmelden",
        "register-button": "Registrieren"
    },
    ar: {
        "page-title": "نقل الأموال وتبادل العملات",
        "currency-exchange-heading": "تبادل العملات",
        "money-transfer-heading": "تحويل الأموال",
        "payment-heading": "إجراء الدفع",
        "payment-description": "ادفع بأمان باستخدام Stripe.",
        "support-heading": "الدعم",
        "modal-title": "تسجيل الدخول",
        "login-button": "تسجيل الدخول",
        "register-button": "التسجيل"
    },
    fr: {
        "page-title": "Transfert d'argent et échange de devises",
        "currency-exchange-heading": "Échange de devises",
        "money-transfer-heading": "Transfert d'argent",
        "payment-heading": "Effectuer un paiement",
        "payment-description": "Payez en toute sécurité avec Stripe.",
        "support-heading": "Support",
        "modal-title": "Connexion",
        "login-button": "Connexion",
        "register-button": "S'inscrire"
    },
    it: {
        "page-title": "Trasferimento di denaro e cambio valuta",
        "currency-exchange-heading": "Cambio valuta",
        "money-transfer-heading": "Trasferimento di denaro",
        "payment-heading": "Effettuare un pagamento",
        "payment-description": "Paga in sicurezza con Stripe.",
        "support-heading": "Supporto",
        "modal-title": "Accesso",
        "login-button": "Accedi",
        "register-button": "Registrati"
    }
};

// Function to change language based on selection
function changeLanguage() {
    let selectedLanguage = document.getElementById("language-select").value;
    let translation = translations[selectedLanguage];

    document.getElementById("page-title").innerText = translation["page-title"];
    document.getElementById("currency-exchange-heading").innerText = translation["currency-exchange-heading"];
    document.getElementById("money-transfer-heading").innerText = translation["money-transfer-heading"];
    document.getElementById("payment-heading").innerText = translation["payment-heading"];
    document.getElementById("payment-description").innerText = translation["payment-description"];
    document.getElementById("support-heading").innerText = translation["support-heading"];
    document.getElementById("modal-title").innerText = translation["modal-title"];
    document.getElementById("login-button").innerText = translation["login-button"];
    document.getElementById("register-button").innerText = translation["register-button"];
}

// Attach event listeners after DOM loads
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("transferButton").addEventListener("click", initiateTransfer);
});
