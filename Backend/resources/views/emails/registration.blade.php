<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Account Registration</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			line-height: 1.6;
			color: #333;
			background-color: #f9f9f9;
			margin: 0;
			padding: 0;
		}
		.container {
			max-width: 600px;
			margin: 20px auto;
			background: #fff;
			padding: 20px;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}
		.header {
			text-align: center;
			margin-bottom: 20px;
		}
		.header h1 {
			margin: 0;
			color: #007BFF;
		}
		.content {
			margin-bottom: 20px;
		}
		.footer {
			text-align: center;
			font-size: 0.9em;
			color: #777;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>Welcome to Our Alumni System</h1>
		</div>
		<div class="content">
			<p>Dear {{ $name }},</p>
			<p>We are excited to inform you that your account has been successfully created. Below are your login credentials:</p>
			<p><strong>ID:</strong> {{ $id }}</p>
			<p><strong>Password:</strong> {{ $password }}</p>
			<p>Please make sure to change your password after logging in for the first time to ensure the security of your account.</p>
			<p>If you have any questions or need assistance, feel free to contact us.</p>
		</div>
		<div class="footer">
			<p>Thank you for joining us!</p>
			<p>&copy; {{ date('Y') }} Alumni System. All rights reserved.</p>
		</div>
	</div>
</body>
</html>