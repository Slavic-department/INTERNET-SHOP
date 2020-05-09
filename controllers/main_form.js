const passport = require('passport');
exports.get_main = (req, res) => {
    res.render('main.ejs')
}

//! ПЕРЕДЕЛАТЬ 35 МИНУТА
exports.post_main = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/#openModal',
    //Если true, то добавит flash-сообщение в случае ошибки.
    failureFlash: true
})