const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

exports.sendConfirmationEmail = async (email, confirmationCode) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Confirm your email',
    html: `
      <h3>Welcome!</h3>
      <p>Click the link below to verify your email:</p>
      <a href="http://localhost:3000/confirm/${confirmationCode}">Verify Email</a>
    `,
  };
  await transporter.sendMail(mailOptions);
};
