export const passwordUpdateTemplate = (name:string, email:string) => {

return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Servora Password Updated</title>
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
    margin-top:25px;
    text-align:center;
    color:#333;
    font-size:16px;
}

.success-box{
    margin:25px auto;
    width:260px;
    padding:15px;
    font-size:18px;
    font-weight:bold;
    background:#f1f3ff;
    border-radius:8px;
    border:2px solid #4a6cf7;
    text-align:center;
}

.account-info{
    margin-top:20px;
    padding:15px;
    background:#f8f9ff;
    border-radius:8px;
    font-size:15px;
    color:#333;
}

.warning{
    margin-top:20px;
    font-size:14px;
    color:#e63946;
    text-align:center;
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
<div class="subtitle">Account Security Notification</div>

<div class="content">
Hello <b>${name}</b>,<br><br>

Your password for the <b>Servora</b> account has been successfully updated.
</div>

<div class="success-box">
Password Updated Successfully
</div>

<div class="account-info">
<b>Account Name:</b> ${name} <br><br>
<b>Email Address:</b> ${email}
</div>

<div class="warning">
If you did not make this change, please reset your password immediately and contact our support team.
</div>

<div class="footer">
Regards,<br>
<b>Sourabh Tembhare</b><br>
Founder, Servora

<div class="support">
Need help? Contact us at <br>
<a href="mailto:sourabhtembhare65@gmail.com">
sourabhtembhare65@gmail.com
</a>
</div>

</div>

</div>

</body>
</html>`

}