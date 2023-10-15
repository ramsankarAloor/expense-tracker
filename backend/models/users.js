const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Users = sequelize.define('users', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    email : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : Sequelize.STRING,
        allowNull : false
    }, 
    isPremium : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
    },
    totalExpense : {
        type : Sequelize.INTEGER,
        defaultValue : 0
    },
    totalIncome : {
        type : Sequelize.INTEGER,
        defaultValue : 0
    }
}, {
    timestamps : false
});

module.exports = Users;