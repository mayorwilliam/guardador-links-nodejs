const passport  = require('passport')
const LocalStrategy = require('passport-local').Strategy

const pool = require('../database')
const helpers =  require('../lib/helpers')


passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (request, username, password, done) => {

  console.log(request.body)
  console.log(username)
  console.log(password)
  const rows = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, request.flash('success', 'Welcome ' + user.username));
    } else {
      done(null, false, request.flash('message', 'Incorrect Password'));
    }
  } else {
    return done(null, false, request.flash('message', 'The Username does not exists.'));
  }

}))

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (request, username, password, done) => {

  const { fullname } = request.body;
  let newUser = {
    fullname,
    username,
    password
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO usuarios SET ? ', newUser);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  done(null, rows[0]);
});