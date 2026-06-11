import nodemailer from 'nodemailer';

export const sendEmail = (
    recipient: string,
    subject: string,
    message: string,
    callback: (error: Error | null, info: nodemailer.SentMessageInfo) => void,
) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: parseInt(process.env.MAILER_PORT || '587', 10),
        secure: process.env.MAILER_PORT === '465',
        auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_PASSWORD,
        },
    });

    const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #4CAF50;
                    padding: 10px;
                    text-align: center;
                    color: #ffffff;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }
                .content {
                    padding: 20px;
                    color: #333333;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    color: #777777;
                    font-size: 12px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 4px;
                    margin-top: 20px;
                }
                .button:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Message</h1>
                </div>
                <div class="content">
                    <p>${message}</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: process.env.MAILER_EMAIL,
        to: recipient,
        subject,
        text: message,
        html: htmlTemplate, // Send HTML email
    };

    transporter.sendMail(mailOptions, callback);
};