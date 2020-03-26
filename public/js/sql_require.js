var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'sweets_downtown'
});

connection.connect();

connection.query('SELECT * FROM клиент', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});

connection.end();