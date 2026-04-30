const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcrypt');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, age, location } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            username,
            password: hashedPassword,
            age,
            address: { location }
        });
        
        await user.save();
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (err) {
        req.flash('error', 'Error registering user. Username might already exist.');
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/tweets',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Welcome back!'
}));

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Successfully logged out.');
        res.redirect('/login');
    });
});

module.exports = router;
