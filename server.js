//подключаем библиотеку .env
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require('express');
const MySql = require('./mysql')
const server = express();
const path = require('path');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')

//Запускать через npm run dev

const users = [];


initializePassport(
  passport,
  //Поиск почты в БД
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

//req.query

//Указывает выбраный хешировщик
const bcrypt  = require('bcrypt');

//Указывает шаблонизатор
server.set('view engine', 'ejs');

//Позволяет парсить то, что приходит из формы.
server.use(express.urlencoded({ extended: false }));



//Поддержка сессий
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
server.use(passport.initialize())
server.use(passport.session())
server.use(methodOverride('_method'))


//Указываем публичную папку
server.use("/public", express.static("public"));

///////////////Маршрутизация////////////////////////////
//req/res - контроллер 
//по центру - middle ware
// server.get('/', checkAuthenticated, (req, res) => {
server.get('/', (req, res) => {
    res.render('main.ejs' /*, { name: req.user.name }*/)
})
server.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('form_autorization.ejs')
})

server.get('/register', checkNotAuthenticated, function(req, res) {
    res.render('form_registration.ejs');
});

//////////////////////////////////////////////////////

//////////////////POST///////////////////////////////

//Создаёт событие при неправильном входе. 
// successRedirect: '/',
// failureRedirect: '/',
server.use(flash());

server.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
})); 

//await работает только с async
server.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        // шифруем пароль
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // заполняем массив usersa данными из формы
        users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
});

//////////////////////////////////////////////////////

//Удаляет сессию
server.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
});

//Проверка на авторизацию
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

//Если авторизован, то нельзя зайти на авторизацию
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
}

// server.get('/item/:id', function(req, res) {
//     res.send('adaasTsdasdahasdsadsdasdifsdfdsfsdfsdfsdfsdfs');
// });

// server.post('/registration', function(req, res) {
//     req.body.email;
// });

//Выбираем порт
server.listen(3000);

//req запрос res ответ next - след. функцияф