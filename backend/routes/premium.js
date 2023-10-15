const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const premiumController = require('../controllers/premium');

router.get('/go-to-leaderboard', authMiddleware.authenticate, premiumController.goToLeaderboard);

module.exports = router;