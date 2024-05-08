const Users = require("../models/users");

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