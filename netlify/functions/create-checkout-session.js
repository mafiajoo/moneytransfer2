require('dotenv').config(); // Load environment variables
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use environment variable for security

exports.handler = async (event) => {
    try {
        console.log("Received request:", event.body); // Debugging log

        const { amount } = JSON.parse(event.body); // Get amount from frontend request

        if (!amount || amount <= 0) {
            throw new Error("Invalid amount provided.");
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd", // Change currency if needed
                        product_data: { name: "Money Transfer" },
                        unit_amount: amount * 100, // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "https://moenyexchanger.netlify.app/success",
            cancel_url: "https://moenyexchanger.netlify.app/cancel",
        });

        console.log("Session created:", session.id); // Debugging log

        return {
            statusCode: 200,
            body: JSON.stringify({ sessionId: session.id }),
        };
    } catch (error) {
        console.error("Error creating checkout session:", error); // Log the actual error
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
