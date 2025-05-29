<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Your Password</title>
    <style>
        body {
            background: #f4f6f8;
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            background: #fff;
            max-width: 480px;
            margin: 40px auto;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(52,144,220,0.08);
            padding: 32px 28px;
        }
        .header {
            text-align: center;
            margin-bottom: 24px;
        }
        .header img {
            width: 60px;
            margin-bottom: 12px;
        }
        .header h2 {
            color: #3490dc;
            margin: 0;
            font-size: 1.7em;
        }
        .content {
            color: #333;
            font-size: 1.07em;
            margin-bottom: 28px;
        }
        .button {
            display: block;
            width: 100%;
            background: #3490dc;
            color: #fff;
            text-align: center;
            padding: 14px 0;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1em;
            margin: 24px 0 18px 0;
            transition: background 0.2s;
        }
        .button:hover {
            background: #2779bd;
        }
        .footer {
            color: #888;
            font-size: 0.97em;
            text-align: center;
            margin-top: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="Reset Icon">
            <h2>Password Reset</h2>
        </div>
        <div class="content">
            <p>Hello <strong>{{ $user->name ?? $user->email }}</strong>,</p>
            <p>We received a request to reset your password. Click the button below to set a new password for your account.</p>
            <a href="{{ $url }}" class="button">Reset Password</a>
            <p>If you did not request a password reset, you can safely ignore this email.</p>
            <p style="margin-top: 18px;">This link will expire in <strong>{{ $expires }} minutes</strong>.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Alumni System. All rights reserved.
        </div>
    </div>
</body>
</html>