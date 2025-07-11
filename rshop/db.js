const mysql = require("mysql2/promise")
const pool = mysql.createPool({
    host: process.env.host || 'localhost',
    user: process.env.user || 'root',
    password:process.env.password || 'sabby123',
    database:process.env.database || 'rootershop',
    waitForConnections: true,
    connectionLimit: 10
})

module.exports=pool