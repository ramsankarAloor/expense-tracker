const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Downloads = sequelize.define('downloads', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    dateTime : {
        type : Sequelize.DATE,
        allowNull: false
    },
    link : {
        type : Sequelize.STRING,
        allowNull:false
    },
    reportOfMonth : {
        type : Sequelize.STRING,
        allowNull:false
    }
}, {
    timestamps : false
})

module.exports = Downloads;