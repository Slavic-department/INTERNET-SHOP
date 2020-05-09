const mysql = require('mysql'); 

//Подключаемся к БД
const connection = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER_NAME,
    password: false,
    database: process.env.DATABASE_NAME
})

connection.connect((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Подкл. к БД закрыто!')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Слишком много подкл. к БД!')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Отказ в соединении с БД')
    }
  }
  
    if (connection) {
      console.log("Подключение к серверу MySQL успешно установлено");
      //освобождает соединение обратно в пул
      // connection.release()
    }
    return
  })
exports.connection = connection;

const model_user = require('./models/user');

