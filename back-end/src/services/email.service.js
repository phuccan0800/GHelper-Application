const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'phucttgcd210070@fpt.edu.vn',
        pass: 'aufs nwph gpzs dodz',
    },
});

// Function to send reset password email
const resetPassword = async (email, code) => {
    try {
        const mailOptions = {
            from: 'phucttgcd210070@fpt.edu.vn',
            to: email,
            subject: `Reset Password: ${code}`,
            html: `<p>Your reset code is: <b>${code}</b>.</p><p>Best regards,<br>GHelper</p>`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Reset password email sent successfully to email ${email}`);
    } catch (error) {
        console.error('Error sending reset password email:', error);
    }
};

module.exports = {
    resetPassword,
};