<<<<<<< HEAD
<<<<<<< HEAD
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    // Handle preflight requests (CORS)
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ message: "CORS preflight response" }),
        };
    }

    try {
        console.log("Received request:", event.body);

        if (!event.body) {
            throw new Error("Request body is empty.");
        }

        const { amount } = JSON.parse(event.body);
        if (!amount || amount <= 0) {
            throw new Error("Invalid amount provided.");
        }

        console.log(`Processing payment for amount: ${amount} USD`);
=======
=======
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
require('dotenv').config(); // Load environment variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


exports.handler = async (event) => {
    try {
        const { amount, currency } = JSON.parse(event.body);
<<<<<<< HEAD
>>>>>>> 7d5042e (Updated files with new features)
=======
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
<<<<<<< HEAD
<<<<<<< HEAD
                        currency: "usd",
                        product_data: { name: "Money Transfer" },
                        unit_amount: amount * 100,
=======
                        currency: currency,
                        product_data: { name: "Money Transfer" },
                        unit_amount: amount * 100, // Stripe uses cents
>>>>>>> 7d5042e (Updated files with new features)
=======
                        currency: currency,
                        product_data: { name: "Money Transfer" },
                        unit_amount: amount * 100, // Stripe uses cents
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
<<<<<<< HEAD
<<<<<<< HEAD
            success_url: "https://moneyexchange.netlify.app/success",
            cancel_url: "https://moneyexchange.netlify.app/cancel",
        });

        console.log("Session created successfully:", session.id);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ sessionId: session.id, url: session.url }),
        };
    } catch (error) {
        console.error("Error creating checkout session:", error.message);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
=======
=======
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
            success_url: "https://your-site.netlify.app/success",
            cancel_url: "https://your-site.netlify.app/cancel",
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ id: session.id }),
        };
    } catch (error) {
        return {
            statusCode: 500,
<<<<<<< HEAD
>>>>>>> 7d5042e (Updated files with new features)
=======
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
            body: JSON.stringify({ error: error.message }),
        };
    }
};
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 7d5042e (Updated files with new features)
=======
>>>>>>> 0516e147b04d2b9aa52a04ae9a322eed14933135
