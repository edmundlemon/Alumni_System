<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Connection Request</title>
	<style>
		body {
			background-color: #f4f6f8;
			font-family: 'Segoe UI', Arial, sans-serif;
			margin: 0;
			padding: 0;
		}
		.container {
			background: #fff;
			max-width: 500px;
			margin: 40px auto;
			border-radius: 8px;
			box-shadow: 0 2px 8px rgba(0,0,0,0.08);
			padding: 32px 24px;
		}
		.header {
			text-align: center;
			padding-bottom: 16px;
		}
		.header h2 {
			color: #2d3e50;
			margin: 0;
		}
		.icon {
			font-size: 48px;
			color: #4a90e2;
			margin-bottom: 8px;
		}
		.content {
			color: #444;
			font-size: 16px;
			line-height: 1.6;
			margin-bottom: 24px;
		}
		.button {
			display: inline-block;
			background: #4a90e2;
			color: #fff;
			text-decoration: none;
			padding: 12px 28px;
			border-radius: 4px;
			font-weight: 600;
			margin-top: 16px;
		}
		.footer {
			margin-top: 32px;
			text-align: center;
			color: #888;
			font-size: 13px;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<div class="icon">🤝</div>
			<h2>New Connection Request</h2>
		</div>
		<div class="content">
			<p>Hello,</p>
			<p><strong>{{ $requestingUser->name }}</strong> wants to connect with you.</p>
			<p>Please log in to your account to respond to this request.</p>
		</div>
		<div class="footer">
			Thank you,<br>
			The Alumni System Team
		</div>
	</div>
</body>
</html>