const express = require('express');

const router = express.Router();
const expenseController = require('../controllers/expense');
const authMiddleware = require('../middlewares/auth');

router.get('/isPremium', authMiddleware.authenticate, expenseController.isUserPremium);

router.post('/expenses', authMiddleware.authenticate, expenseController.getExpenses);

router.post('/new-expense', authMiddleware.authenticate, expenseController.postNewExpense);

router.delete('/expenses/:id', authMiddleware.authenticate, expenseController.deleteExpense);

router.delete('/incomes/:id', authMiddleware.authenticate, expenseController.deleteIncome);

module.exports = router;