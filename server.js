if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const server = express();
const path = require('path');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override')

// const server_contorol = require('./server_control');
//Запускать через npm run dev

const users = [];

const initializePassport = require('./passport-config')
initializePassport(
  passport,
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

server.use(flash());
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

// server.get('/', function(req, res) {
//     res.render('');
// });
server.get('/', checkAuthenticated, (req, res) => {
    res.render('main.ejs', { name: req.user.name })
})
server.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

server.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})); 

server.get('/registration', checkNotAuthenticated, function(req, res) {
    res.render('form_registration.ejs');
});

server.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
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

server.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}
  
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

server.listen(3000);
