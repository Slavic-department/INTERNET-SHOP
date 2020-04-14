//Используем локальную стратегию
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

//pasport просто библиотека
function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  };

  //имя поля в форме
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  //Формирует сессию
  passport.serializeUser((user, done) => done(null, user.id))
  //Берёт пользователя из базы пользователей.
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize;