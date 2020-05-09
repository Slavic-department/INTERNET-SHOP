const LocalStrategy = require('passport-local').Strategy //пользователь и пароль
const bcrypt = require('bcrypt')
const models_user = require('./models/user')

//pasport просто библиотека
function initializePassport(passport) {

  const authenticateUser = async (email, password, done) => {
    const user = await models_user.selectUserByEmail(email)
    if (user == null) {
      done(null, false, { message: 'Нет пользователя с такой почтой' })
    }
    try {
      if (await bcrypt.compare(password, user.data.Пароль)) {
        done(null, user);
      } else {
        done(null, false, { message: 'Неправельный пароль' })
      }
    } catch (err) {
      done(err);
    }
  };

  //имя поля в форме
  passport.use(new LocalStrategy({
     usernameField: 'email',
      passwordField: 'password'
      // passReqToCallback : true 
  }, authenticateUser))

  //срабатывает, когда нужно записать юзера в какой-нибудь строковой вид (например, в куки записать id-шник этого юзера)
  passport.serializeUser((user, done) => {
    console.log("serialize user"); 
    done(null, user.data.ID_пользователя)
  })

  //срабатывает тогда, когда были получены эти самые данные (в нашем примере id-шник в куки) и нужно по ним вернуть обратно юзера 
  passport.deserializeUser(async (id, done) => {
    console.log("de-serialize user");
    let selectResult = await models_user.selectUserById(id);
    if(selectResult.error) {
      done(null, false, {message: "Внутрення ошибка ( "})
    }
    done(null, selectResult.data)
  })
}

module.exports = initializePassport;