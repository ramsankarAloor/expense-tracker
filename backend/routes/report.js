const express = require('express');
const reportController = require('../controllers/report');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.post('/monthlyList', authMiddleware.authenticate, reportController.monthlyList);
router.post('/download-monthly-list', authMiddleware.authenticate, reportController.downloadMonthlyList);
router.get('/list-downloads', authMiddleware.authenticate, reportController.listDownloads);
router.post('/add-to-downloads', authMiddleware.authenticate, reportController.addToDownloads);

module.exports = router;
