// Load Stripe
const stripe = Stripe("your-stripe-public-key-here");

// Ensure the script runs after DOM loads
document.addEventListener("DOMContentLoaded", function () {
    let transferButton = document.getElementById("transferButton");
    let payButton = document.getElementById("payButton");

    // Check if the buttons exist before adding event listeners
    if (transferButton) {
        transferButton.addEventListener("click", initiateTransfer);
    } else {
        console.error("Error: transferButton not found in DOM");
    }

    if (payButton) {
        payButton.addEventListener("click", processPayment);
    } else {
        console.error("Error: payButton not found in DOM");
    }
});

// Function to Process Stripe Payment
async function processPayment() {
    let amount = document.getElementById("transfer-amount").value;

    if (amount <= 0) {
        alert("Invalid payment amount.");
        return;
    }

    try {
        // Simulating payment request (must have a backend)
        let response = await fetch("/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amount * 100 }) // Convert to cents for Stripe
        });

        let session = await response.json();

        if (!session.id) {
            console.error("Error: No session ID returned from the server.");
            alert("Payment session failed. Please try again.");
            return;
        }

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) {
            console.error("Stripe error:", result.error);
            alert("Payment failed. Please try again.");
        }
    } catch (error) {
        console.error("Error processing payment:", error);
        alert("Something went wrong. Please try again.");
    }
}
