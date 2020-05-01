const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const models_user = require('./models/user')
async function fff(){
  //    let q = (await models_user.selectUserById(1).data.Email)
  //    console.log(q)
      // let user = await models_user.selectUserByEmail('timur.sholokh@gmail.com')
      // console.log(user.data.Пароль)
  }
  // fff()

//pasport просто библиотека
function initializePassport(passport) {

  const authenticateUser = async (email, password, done) => {
    const user = await models_user.selectUserByEmail(email)
    if (user == null) {
      // Стратегии требуют так называемого обратного вызова проверки done. Цель обратного вызова проверки - найти пользователя, обладающего набором учетных данных.
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
    console.log(user.data.ID_пользователя)
    done(null, user.data.ID_пользователя)
  })

  //срабатывает тогда, когда были получены эти самые данные (в нашем примере id-шник в куки) и нужно по ним вернуть обратно юзера 
  passport.deserializeUser(async (id, done) => {
    console.log(id)
    console.log("de-serialize user");
    let selectResult = await models_user.selectUserById(id);
    if(selectResult.error) {
      done(null, false, {message: "Внутрення ошибка ( "})
    }
    done(null, selectResult.data)
  })
}

module.exports = initializePassport;