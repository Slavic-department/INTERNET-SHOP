//подключаем файлик.env, если он есть
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//Нужен для создания ВЕБ-приложения
const express = require('express');
const server = express();

const mysql = require('./mysql');
const models_user = require('./models/user')

var cookieParser = require('cookie-parser')
server.use(cookieParser())

//Нужен для ненавязчивой аутентификации и выбора стратегии
const passport = require('passport');

//Это серверные сообщения, которые отображаются только один раз.
const flash = require('express-flash');

//Надо для созданий и удалений сессий
const session = require('express-session');
//Позволяет использовать HTTP-глаголы, такие как PUT или DELETE, в местах, где клиент их не поддерживает.


const methodOverride = require('method-override')
//
const initializePassport = require('./passport-config')

//Чтобы получать значения POST в Express, 
const bodyParser = require('body-parser')
server.use(bodyParser.urlencoded({ extended: false }))
//Позволяет выводить ошибку на форму 
server.use(flash());

//Запускать через npm run dev

initializePassport(passport)

async function fff(req){
//    let q = (await models_user.selectUserById(1).data.Email)
//    console.log(q)
    let user = await models_user.selectUserByEmail('timur.sholokh@gmail.com')
    // console.log(user.data.Пароль)
    // if (req.isAuthenticated()) {
    //     console.log('Авторизван')
    // }else{
    //     console.log('Не авторизван')
    // }
}
// fff()

//Указывает выбраный хешировщик
const bcrypt  = require('bcrypt');

//Указывает шаблонизатор
server.set('view engine', 'ejs');

//Позволяет парсить то, что приходит из формы.
server.use(express.urlencoded({ extended: false }));

//Поддержка сессии
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
server.get('/', checkAuthenticated, (req, res) => {
    res.render('main.ejs')
})

server.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/#openModal',
    //Если true, то добавит flash-сообщение в случае ошибки.
    failureFlash: true
})); 

server.get('/register', function(req, res) {
    res.render('form_registration.ejs', {
        data: {},
        errors: {}
    })
})


//Моя регистрация
server.post('/register', async (req, res) => {
    if(req.body.name == '' &&  req.body.password == ''){
        let error = 'asdasd'
        res.render('form_registration', {
            data: req.body, 
            errors: {
                emptiness: {
                    msg: 'Вы не заполнили одно из полей'
               }
            }
          })
    }else{
        try {
            // шифруем парольaa
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            await models_user.insertUser(req.body.name, req.body.email, hashedPassword)

            res.redirect('/')
        } catch {
            res.redirect('/register')
        }
    }
})

//Удаляет вход в сессию
server.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

//Проверка авторизован, то нельзя зайфти
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Авторизован!!!")
        next()
        // return next()
    }else{
        console.log("Не Авторизован!!!")
        next()
    }
    // res.redirect('/')
}

function checkmiddleware(req, res, next) {
 console.log("Мидллвар дощел до этого места")
 next()
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
