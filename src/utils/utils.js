export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpHtml(otp) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>OTP Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
        </style>
    </head>
    <body>
        <h1>OTP for your account verification is</h1>
        <b><h2>${otp}</h2></b>
        <p>Please use this OTP to verify your account. This OTP is valid for a limited time only.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <p>For security reasons, please do not share this OTP with anyone.</p>
        <p>Thank you for using our service!</p>
    </body>
    </html>
    `
}