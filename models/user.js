const mysql = require('../mysql')

// exports.selectUserByName = (username) =>{
//     //Promise ждёт, пока функция не выполнится.
//     return new Promise((resolve, reject) => {
//         let query = mysql.connection.query("SELECT * FROM клиент WHERE ФИО = ?", [username], (error, rows) => {
//             if(error){
//                 console.log("Ошибка в запросе : " + query.sql + ', ' + error.code);
//                 //resolve вызывается тогда, когда закончится ассинхронная операция
//                 reject({ error: true, data: null})
//             }else{
//                 resolve({error: false, data: rows})
//             }
//         })
//     })
// }

//Запросы в базу

//Контролеры обработчики запросов для рендеринга старц