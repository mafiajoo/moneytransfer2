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

