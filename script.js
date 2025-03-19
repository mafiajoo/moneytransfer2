let users = []; // Simulate user database for the purpose of this demo

// Function to show the login form
function showLoginForm() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("register-form").style.display = "none";
}

// Function to show the register form
function showRegisterForm() {
    document.getElementById("register-form").style.display = "block";
    document.getElementById("login-form").style.display = "none";
}

// Function to simulate registration
function register() {
    let name = document.getElementById("register-name").value;
    let email = document.getElementById("register-email").value;
    let password = document.getElementById("register-password").value;

    if (!name || !email || !password) {
        document.getElementById("register-error").innerHTML = "Please fill in all fields.";
        return;
    }

    // Save user data (in a real-world scenario, you'd store this in a database)
    users.push({ name, email, password });
    document.getElementById("register-form").reset();
    alert("Registration successful! Please log in.");
}

// Function to simulate login
function login() {
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    if (!email || !password) {
        document.getElementById("login-error").innerHTML = "Please fill in both fields.";
        return;
    }

    // Check if user exists
    let user = users.find(user => user.email === email && user.password === password);

    if (user) {
        document.getElementById("auth-links").style.display = "none"; // Hide login/register links
        document.getElementById("auth-section").style.display = "block"; // Show main content
        document.getElementById("user-name").innerText = user.name;
    } else {
        document.getElementById("login-error").innerHTML = "Invalid email or password.";
    }
}

// Function to calculate currency exchange
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

// Function to validate phone number
function validatePhoneNumber(phone) {
    let regex = /^\d{7,15}$/;
    return regex.test(phone);
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

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("transferButton").addEventListener("click", initiateTransfer);
});
