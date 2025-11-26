
// Manual way to connect to mysql database

// require('dotenv').config();
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_PORT
// });

// module.exports = pool.promise();

// Sequelize auotmatcly connect to mysql db

const Sequelize = require('sequelize');

const sequalize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
);

module.exports = sequalize;