const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

router.get('/', (req, res) => {
    res.render('login');
});
router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}));
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}));
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});
router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;