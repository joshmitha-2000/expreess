const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

exports.sendConfirmationEmail = async (email, confirmationCode) => {
  // ✅ Hardcoded production URL
  const confirmationUrl = `https://frescobackend.onrender.com/confirm/${confirmationCode}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Confirm your email',
    html: `
      <h3>Welcome!</h3>
      <p>Click the link below to verify your email:</p>
      <a href="${confirmationUrl}">Verify Email</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};
