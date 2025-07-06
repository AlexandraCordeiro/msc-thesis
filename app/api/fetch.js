export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  if (!url.startsWith("https://cdn.cosmicjs.com/")) {
    return res.status(403).json({ error: 'Invalid URL domain' });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch or parse the JSON file' });
  }
}
