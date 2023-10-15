const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expenses = sequelize.define('expenses', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    amount : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    description : {
        type : Sequelize.STRING
    },
    category : {
        type : Sequelize.STRING,
        allowNull : false
    },
    date : {
        type : Sequelize.DATEONLY,
        allowNull : false
    }, 
    isIncome : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
    }
})

module.exports = Expenses;