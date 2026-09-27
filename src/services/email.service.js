import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS
    }
});

export const sendVerificationEmail = async (
    email,
    name,
    verificationToken
) => {
    await transporter.sendMail({
        from: ENV.SMTP_USER,
        to: email,
        subject: "Verify your email",
        text: `Hello ${name}, your verification token is ${verificationToken}`
    });
};

export const sendReminderEmail = async (email, name) => {
    console.log("Sending reminder to:", email);

    const info = await transporter.sendMail({
        from: ENV.SMTP_USER,
        to: email,
        subject: "Reminder",
        text: `Hello ${name}, this is your reminder email.`
    });

    console.log("Reminder sent:", info.messageId);
};

try {
    await transporter.verify();
    console.log("Email Service is ready to take our messages");
} catch (err) {
    console.error("Verification failed:", err);
}

// try {
//   const info = await transporter.sendMail({
//     from: '"Example Team" <team@example.com>', // sender address
//     to: "alice@example.com, bob@example.com", // list of recipients
//     subject: "Hello", // subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // HTML body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Preview URL is only available when using an Ethereal test account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// } catch (err) {
//   console.error("Error while sending mail:", err);
// }