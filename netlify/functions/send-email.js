const nodemailer = require("nodemailer");

exports.handler = async function (event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { name, email, phone, message } = JSON.parse(event.body);

    if (!name || !email || !phone || !message) {
        return { statusCode: 400, body: JSON.stringify({ success: false, error: "All fields are required" }) };
    }

    // Configure email transporter
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "egyptsupplies100@gmail.com",
            pass: "YOUR_APP_PASSWORD" // You need to generate an App Password for Gmail
        }
    });

    let mailOptions = {
        from: email,
        to: "egyptsupplies100@gmail.com",
        subject: "New Support Message",
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
    }
};
