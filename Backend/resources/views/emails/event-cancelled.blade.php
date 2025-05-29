<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Event Cancelled Notification</title>
</head>
<body>
	<h2>Event Cancelled</h2>
	<p>Dear {{ $user->name }},</p>
	<p>We regret to inform you that the event <strong>{{ $event->event_title }}</strong> scheduled for <strong>{{ $event->event_date ? $event->event_date . ', ' . $event->event_time : 'Date not available' }}</strong> has been cancelled.</p>
	<p>We apologize for any inconvenience this may cause. If you have any questions, please contact us at {{ config('mail.from.address') }}.</p>
	<p>Thank you for your understanding.</p>
	<br>
	<p>Best regards,<br>
	MMU Alumni System Team</p>
</body>
</html>
