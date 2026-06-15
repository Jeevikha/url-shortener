const Url = require('../models/Url');
const { nanoid } = require('nanoid');

// Validate a URL string
const isValidUrl = (str) => {
  try { new URL(str); return true; }
  catch { return false; }
};

// POST /api/urls - Create a short URL
const createUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !isValidUrl(originalUrl))
    return res.status(400).json({ message: 'Invalid URL' });

  try {
    const shortCode = nanoid(6); // e.g. "aB3xYz"
    const url = await Url.create({
      user: req.user.id,
      originalUrl,
      shortCode,
    });

    res.status(201).json({
      ...url.toObject(),
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/urls - Get all URLs for logged-in user
const getUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Attach full short URL to each result
    const result = urls.map(u => ({
      ...u.toObject(),
      shortUrl: `${process.env.BASE_URL}/${u.shortCode}`,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/urls/:id - Delete a URL (only if it belongs to the user)
const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json({ message: 'URL not found' });

    if (url.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await url.deleteOne();
    res.json({ message: 'URL deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/urls/:id/analytics - Get analytics for a specific URL
const getAnalytics = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json({ message: 'URL not found' });

    if (url.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    res.json({
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      lastVisited: url.visits.length > 0 ? url.visits[url.visits.length - 1].visitedAt : null,
      recentVisits: url.visits.slice(-10).reverse(), // last 10 visits
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createUrl, getUrls, deleteUrl, getAnalytics };