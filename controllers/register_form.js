exports.get_register = function(req, res) {
    res.render('form_registration.ejs', {
        data: {},
        errors: {}
    })
}

exports.post_register =  async (req, res) => {
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
            await models_user.insertUser(req.body.name, req.body.email, hashedPassword)

            res.redirect('/')
        } catch {
            res.redirect('/register')
        }
    }
}

exports.logout = (req, res) => {
    req.logOut()
    res.redirect('/')
}

//Проверка на авторизацию / не авторизацию
exports.checkAuthenticated = (req, res, next) => {
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
exports.checkNotAuthenticated = (req, res, next) => {
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
