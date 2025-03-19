require('dotenv').config(); // Load environment variables
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use Netlify env variable

exports.handler = async (event) => {
    try {
        const { amount } = JSON.parse(event.body); // Get amount from frontend request

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

        return {
            statusCode: 200,
            body: JSON.stringify({ sessionId: session.id }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
