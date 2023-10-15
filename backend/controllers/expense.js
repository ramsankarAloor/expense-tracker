const Expenses = require("../models/expenses");
const sequelize = require("../util/database");
const Users = require("../models/users");

exports.isUserPremium = async (req, res) => {
  const user = await Users.findOne({ where: { id: req.user.id } });
  res.json(user.isPremium);
};

exports.getExpenses = async (req, res) => {
  if(req.body.isIncome===false){
    const expenses = await Expenses.findAll({
      where: { userId: req.user.id, date: req.body.date, isIncome:false },
    });
    res.json(expenses);
  }else{
    const incomes = await Expenses.findAll({
      where: { userId: req.user.id, date: req.body.date, isIncome:true },
    });
    res.json(incomes);
  }
  
};

exports.postNewExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (!req.body.amount) {
      throw new Error("Amount field is mandatory..!");
    }
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const date = req.body.date;
    const isIncome = req.body.isIncome;

    const newEntry = await Expenses.create(
      {
        amount,
        description,
        category,
        date,
        isIncome,
        userId: req.user.id,
      },
      { transaction: t }
    );

    if (isIncome === false) {
      const totalExpense = Number(req.user.totalExpense) + Number(amount);
      Users.update(
        {
          totalExpense: totalExpense,
        },
        {
          where: { id: req.user.id },
        },
        {
          transaction: t,
        }
      );
    } else {
      const totalIncome = Number(req.user.totalIncome) + Number(amount);
      Users.update(
        {
          totalIncome: totalIncome,
        },
        {
          where: { id: req.user.id },
        },
        {
          transaction: t,
        }
      );
    }

    await t.commit();
    res.status(201).json(newEntry);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      error: "Error occured while creating an expense",
    });
  }
};

exports.deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.id;
    const { amount } = await Expenses.findOne({ where: { id: expenseId } });

    const result = await Expenses.destroy(
      {
        where: { id: expenseId, userId: req.user.id },
      },
      { transaction: t }
    );

    const totalExpense = Number(req.user.totalExpense) - Number(amount);

    Users.update(
      {
        totalExpense: totalExpense,
      },
      {
        where: { id: req.user.id },
      },
      {
        transaction: t,
      }
    );
    await t.commit();
    res.json(result);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: "Error in delete expense " });
  }
};

exports.deleteIncome = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const incomeId = req.params.id;
    const {amount} = await Expenses.findOne({ where:{ id:incomeId } });

    const result = await Expenses.destroy({
      where: { id: incomeId, userId: req.user.id },
    }, {transaction:t});

    const totalIncome = Number(req.user.totalIncome) - Number(amount);

    Users.update(
      {
        totalIncome: totalIncome,
      },
      {
        where: { id: req.user.id }
      },{
        transaction : t
      }
    );
    await t.commit();
    res.json(result);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error : "Error in delete expense "})
  }
};