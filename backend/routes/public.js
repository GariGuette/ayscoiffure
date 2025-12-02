const express = require('express');
const router = express.Router();

// Page publique d'information
router.get('/salon', async (req, res) => {
  res.json({
    message: 'Information du salon disponible'
  });
});

module.exports = router;
