const mysql = require('mysql'); 
const express = require('express');
const server = express();
const mysqlSession = require('express-mysql-session');
const expressSession = require('express-session');
const model_user = require('./models/user');

//Подключаемся к БД
const mysqlStore = mysqlSession({
    schema: {
        tableName: "sessions",
        column: {
            session_id: "session_id",
            expires: "expires", //Указывает дату время истекания сесии
            data: "data" //Данные про пользовтеля
        }
    }
}, mysql.connection);

//aa
server.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mysqlStore
}));

connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: false,
    database: 'sweet_downtown'
})
exports.connection = connection;



//Тестовая функция
exports.init = () => {
    connection.connect((error) => {
        if (error != null) {
            console.log("MySQL connection error:")
            console.log(error.code)
        } else {
            console.log("MySQL successfully connected.")
        }
    })
}

// model_user.selectUserByName('Шолох Тимур Олександрович').then(data => {
//     console.log(data);
// })