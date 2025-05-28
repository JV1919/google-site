export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, content } = req.body;
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'Unknown IP';

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return res.status(500).json({ message: 'Webhook URL not configured' });
  }

  try {
    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username || 'Not Specified',
        content: `${content}\n\n📍 IP-adres: ${ip}`
      }),
    });

    if (!discordRes.ok) {
      throw new Error('Failed to send webhook');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
