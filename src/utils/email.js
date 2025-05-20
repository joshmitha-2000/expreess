const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

exports.sendConfirmationEmail = async (email, confirmationCode) => {
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

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    throw new Error('Failed to send confirmation email');
  }
};
