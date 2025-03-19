require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    try {
        console.log("Received request:", event.body); // Debugging log
        
        // Ensure request body exists
        if (!event.body) {
            throw new Error("No request body received.");
        }

        const { amount } = JSON.parse(event.body); // Parse JSON safely
        
        if (!amount || isNaN(amount) || amount <= 0) {
            throw new Error("Invalid amount provided.");
        }

        console.log(`Processing payment for amount: ${amount} USD`);

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: "Money Transfer" },
                        unit_amount: Math.round(amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "https://moenyexchanger.netlify.app/success",
            cancel_url: "https://moenyexchanger.netlify.app/cancel",
        });

        console.log("Session created successfully:", session.id);

        return {
            statusCode: 200,
            body: JSON.stringify({ sessionId: session.id }),
        };
    } catch (error) {
        console.error("Error creating checkout session:", error.message);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "Internal server error" }),
        };
    }
};
