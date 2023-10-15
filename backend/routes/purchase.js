const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const purchaseController = require('../controllers/purchase');

router.get('/premium-membership', authMiddleware.authenticate, purchaseController.purchasePremium);
router.post('/update-transaction-status', authMiddleware.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;