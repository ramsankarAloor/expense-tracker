const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense-tracker', 'root', '5454', {
    dialect : 'mysql',
    host : 'localhost'
})

module.exports = sequelize;