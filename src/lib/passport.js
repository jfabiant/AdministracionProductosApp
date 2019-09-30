const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database/db');

passport.use('local.login', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, login, password, done) => {
    const result = await pool.query("SELECT * FROM users WHERE login = ? AND password = ?", [login, password]);
    console.log(result);
    if (result.length > 0) {
        const user = result[0];
        done(null, user);
    } else {
        return done(null, false, req.flash('message', 'El usuario no existe'));
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, login, password, done) => {

    try {
        const new_user = {
            login,
            password
        }

        const result = await pool.query('INSERT INTO users SET ?', [new_user]);
        console.log("###### RESULT QUERY ######");
        console.log(result);

        new_user.id = result.insertId
        console.log("###### USER ######");
        console.log(new_user);

        return done(null, new_user);

    } catch (e) {

        return done(null, false, req.flash('message', 'Registrese con otro usuario'));

    }

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, rows[0]);
});