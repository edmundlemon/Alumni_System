<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Password</title>
</head>
<body>
    <h2>Password Reset Request</h2>
    <p>Hello {{ $user->name ?? $user->email }},</p>
    <p>Click the button below to reset your password:</p>
    <a href="{{ $url }}" style="background: #3490dc; color: white; padding: 10px 20px; text-decoration: none;">Reset Password</a>
    <p>This link will expire in {{ $expires }} minutes.</p>
</body>
</html>
