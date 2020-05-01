const connection = require('../mysql').connection;

exports.selectUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        let query = connection.query("SELECT * FROM пользователи WHERE Email = ?", [email], (error, rows) => {
            if(error){
                console.log("Ошибка в запросе : " + query.sql + ', ' + error.code);
                reject({ error: true, data: null})
            }else{
                //resolve вызывается тогда, когда закончится ассинхронная операция
                resolve({error: false, data: rows[0]})
            }
        })
    })
}
exports.selectUserById = async (ID) => {
    return new Promise((resolve, reject) => {
        let query = connection.query("SELECT * FROM пользователи WHERE ID_пользователя = ?", [ID], (error, rows) => {
            if(error){
                console.log("Ошибка в запросе : " + query.sql + ', ' + error.code);
                reject({ error: true, data: null})
            }else{
                //resolve вызывается тогда, когда закончится ассинхронная операция
                resolve({error: false, data: rows[0]})
            }
        })
    })
}

exports.insertUser = async (Name, Email, Password) => {
    let query = connection.query("INSERT INTO пользователи (Имя, Email, Пароль) VALUES (?, ?, ?)", [Name, Email, Password], (error, rows) => {
        if(error){
            console.log("Ошибка в запросе : " + query.sql + ', ' + error.code);
            reject({ error: true, data: null})
        }
    })
}