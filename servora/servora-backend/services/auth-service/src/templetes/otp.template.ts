

export const sendMailTemplate = (otp:number) => {
    
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Servora OTP Verification</title>
<style>
body{
    margin:0;
    padding:0;
    background:#f4f6fb;
    font-family: Arial, Helvetica, sans-serif;
}

.container{
    max-width:600px;
    margin:auto;
    background:#ffffff;
    padding:30px;
    border-radius:10px;
    box-shadow:0 5px 15px rgba(0,0,0,0.05);
}

.header{
    text-align:center;
    font-size:28px;
    font-weight:bold;
    color:#4a6cf7;
}

.subtitle{
    text-align:center;
    color:#555;
    margin-top:5px;
}

.content{
    margin-top:30px;
    text-align:center;
    color:#333;
    font-size:16px;
}

.otp-box{
    margin:25px auto;
    width:220px;
    padding:15px;
    font-size:26px;
    letter-spacing:6px;
    font-weight:bold;
    background:#f1f3ff;
    border-radius:8px;
    border:2px dashed #4a6cf7;
    text-align:center;
}

.expire{
    color:#e63946;
    font-size:14px;
    margin-top:10px;
}

.footer{
    margin-top:35px;
    font-size:13px;
    color:#777;
    text-align:center;
}

.support{
    margin-top:10px;
}

a{
    color:#4a6cf7;
    text-decoration:none;
}
</style>
</head>

<body>

<div class="container">

<div class="header">Servora</div>
<div class="subtitle">Secure OTP Verification</div>

<div class="content">
Hello,<br><br>

Use the OTP below to verify your account on <b>Servora</b>.
</div>

<div class="otp-box">
${otp}
</div>

<div class="content">
This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.
</div>

<div class="expire">
OTP will expire in 5 minutes.
</div>

<div class="footer">
Regards,<br>
<b>Sourabh Tembhare</b><br>
Founder, Servora

<div class="support">
Need help? Contact us at  
<a href="mailto:sourabhtembhare65@gmail.com">
sourabhtembhare65@gmail.com
</a>
</div>

</div>

</div>

</body>
</html>`

}