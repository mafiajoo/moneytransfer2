require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    console.log("Received request method:", event.httpMethod);

    // ✅ Handle CORS Preflight Requests
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ message: "CORS preflight response" }),
        };
    }

    // ✅ Ensure it's a POST request
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        const { amount, currency } = JSON.parse(event.body);
        console.log("Processing payment for:", amount, currency);

        // ✅ Ensure amount is valid
        if (!amount || isNaN(amount) || amount <= 0) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "Invalid amount" }),
            };
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: currency || "usd",
                        product_data: { name: "Money Transfer" },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "https://moneyexchangeing.netlify.app/success",
            cancel_url: "https://moneyexchangeing.netlify.app/cancel",
        });

        console.log("Session created:", session.id);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ sessionId: session.id, url: session.url }),
        };
    } catch (error) {
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
