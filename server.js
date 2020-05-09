// *Запускать сервер через npm run dev

//подключаем файл .env, если он есть
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//Нужен для создания ВЕБ-приложения
const express = require('express')
const server = express()

//Указывает шаблонизатор
server.set('view engine', 'ejs');

//Позволяет использовать .put().delete().patch() при отлавливании запроса
const methodOverride = require('method-override')
server.use(methodOverride('_method'))

// !Позволяет выводит flash сообщения на страницу при помощи сесий (проверить на роботу с сесией в другом модуле)
const flash = require('connect-flash');
server.use(flash());

// *Указываем публичную папку
server.use("/public", express.static("public"));

//Указывает выбраный хешировщик для паролей
const bcrypt  = require('bcrypt');

//Позволяет брать значения из формы при помощи req.body
const bodyParser = require('body-parser')
server.use(bodyParser.urlencoded({ extended: false })) //true, чтобы принимать переменные в виде массива

const mysql = require('./mysql');

//Нужно для созданий и удалений сессий
const session = require('express-session');

const MySQLStore = require('express-mysql-session');
const mysqlStore = MySQLStore({
    schema: {
        tableName: "sessions",
        columnNames: {
            session_id: "session_id",
            expires: "expires",
            data: "data"
        }
    }
  }, mysql.connection)
  
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mysqlStore //храним сессию в бд.
}));

//Нужен для ненавязчивой аутентификации и выбора стратегии
const passport = require('passport')
const initializePassport = require('./passport-config')
initializePassport(passport)
server.use(passport.initialize())
server.use(passport.session())

//Нужно для работы с куки (Этот модуль использовать другие модули)
let cookieParser = require('cookie-parser');
server.use(cookieParser());

/*-------------------Модели-------------------*/
const models_user = require('./models/user')

/*-----------------Контроллеры-----------------*/
const main_form = require('./controllers/main_form')
const register_form = require('./controllers/register_form')

/*-----------------Маршрутизация-----------------*/
server.get('/', register_form.checkAuthenticated, main_form.get_main)

server.post('/', main_form.post_main); 

server.get('/register', register_form.checkAuthenticated, register_form.get_register)

server.post('/register', register_form.post_register)

//Удаляет вход в сессию
server.delete('/logout', register_form.logout)

//Выбираем порт
server.listen(3000);
