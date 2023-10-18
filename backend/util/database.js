const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense-tracker', 'root', 'Hawking@12', {
    dialect : 'mysql',
    host : 'localhost'
})

module.exports = sequelize;