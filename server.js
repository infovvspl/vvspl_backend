require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

app.get("/", (req, res) => {
    res.json({ status: "API is running" });
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ ok: false, error: "Missing required fields" });
        }

        const info = await transporter.sendMail({
            from: `"${name}" <${process.env.SMTP_USER}>`,
            replyTo: email,
            to: "info@vvspltech.com",
            subject: subject || `New contact form message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        });

        console.log("Email sent: ", info.messageId); // 🔹 Log success

        res.status(200).json({ ok: true }); // Ensure 200 status
    } catch (e) {
        console.error("SendMail Error: ", e); // 🔹 Log exact error
        res.status(500).json({ ok: false, error: e.message });
    }
});

app.listen(3001, "0.0.0.0", () => {
    console.log("API running on :3001");
});
