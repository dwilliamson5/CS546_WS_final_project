const express = require('express');
const router = express.Router();
const data = require('../data/index');
const users = data.users;
const validation = require('../data/validations/userValidations');

router.get('/login', async (req, res) => {

    if (req.session.user) {
        return res.redirect('/');
    }

    res.render('auth/login', { title: 'Login' });
});

router.get('/logout', async (req, res) => {
    if (req.session.user) {
        req.session.destroy();

        res.render('auth/loggedout', { title: 'Logged out' });
    } else {
        res.redirect('/');
    }
});

router.get('/signup', async (req, res) => {

    if (req.session.user) {
        return res.redirect('/');
    }

    res.render('auth/signup', { title: 'Sign Up' });
})

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;
    const imageURL = 'todo';//req.body.profileImageUrl;
    const bio = req.body.bio;

    try {
        // Check parameters
        validation.isValidUserParameters(username, password, name, email, imageURL, bio);

        // Check if user already exists
        if (await users.getUser(username) !== null) {
            throw 'That username already exists!';
        }
    } catch (e) {
        return res.status(400).render('auth/signup', {
            title: 'Sign Up',
            error_status_code: 'HTTP 400 status code',
            error_messages: e
        });
    }

    try {
        const response = await users.createUser(username, password, name, email, imageURL, bio);

        if (response === null || response.userInserted === false) {
            return res.status(500).render('auth/signup', {
                title: 'Sign Up',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error: ' + e
            });
        }

        if (response.userInserted === true) {
            req.session.user = { username: username };

            res.redirect('/');
        }
    }
    catch (e) {
        return res.status(500).render('auth/signup', {
            title: 'Sign Up',
            error_status_code: 'HTTP 500 status code',
            error_messages: 'Internal Server Error: ' + e
        });
    }
})

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!validation.isValidUsername(username) ||
            !validation.isValidPassword(password)) {
            throw 'Invalid username or password!'
        }

        const response = await users.checkUser(username, password);

        if (response === null || response.authenticated !== true) {
            return res.status(500).render('auth/login', {
                title: 'Login',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error'
            });
        }

        if (response.authenticated === true) {
            req.session.user = { username: username };

            res.redirect('/');
        }
    }
    catch (e) {
        return res.status(400).render('auth/login', {
            title: 'Login',
            error_status_code: 'HTTP 400 status code',
            error_messages: e
        });
    }
})

module.exports = router;
