const Users = require("../models/users");
const Expenses = require("../models/expenses");
const sequelize = require('../util/database');

exports.goToLeaderboard = async (req, res) => {
    try {
        const leaderboardArray = await Users.findAll({
            attributes : ['id', 'name', 'totalExpense'],
            order : [['totalExpense', 'DESC']]
        });
        res.status(200).json(leaderboardArray); 
    } catch (error) {
        res.status(500).json({error : error});
    }
    
}