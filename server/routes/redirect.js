const express = require('express');
const router = express.Router();
const Url = require('../models/Url');

// GET /:code - Redirect short URL to original URL and record the visit
router.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) return res.status(404).json({ message: 'URL not found' });

    // Increment click count and save the visit timestamp
    url.clicks += 1;
    url.visits.push({ visitedAt: new Date() });
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;