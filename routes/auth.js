const express = require('express');
const router = express.Router();
const data = require('../data/index');
const users = data.users;
const universities = data.universities;
const validation = require('../data/validations/userValidations');

router.get('/login', async (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }

    const universities = await universities.getAll();

    res.render('auth/login', { title: 'Login', universities: universities });
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

    const universitiesList = await universities.getAll();

    res.render('auth/signup', { title: 'Sign Up', universities: universities });
})

router.post('/signup', async (req, res) => {
    const universityId = req.body.universityId;
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;
    const imageURL = 'todo';//req.body.profileImageUrl;
    const bio = req.body.bio;

    try {
        // Check parameters
        validation.isValidUserParameters(universityId, username, password, name, email, imageURL, bio);
    } catch (e) {
        return res.status(400).render('auth/signup', {
            title: 'Sign Up',
            error_status_code: 'HTTP 400 status code',
            error_messages: e
        });
    }

    try {
        const response = await users.createUser(universityId, username, password, name, email, imageURL, bio);

        if (response === null || response.userInserted === false) {
            return res.status(500).render('auth/signup', {
                title: 'Sign Up',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error: ' + e
            });
        }

        if (response.userInserted === true) {
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
    const universityId = req.body.universityId;
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!validation.isValidUsername(username) ||
            !validation.isValidPassword(password)) {
            throw 'Invalid username or password!'
        }

        if (!validation.isValidUniversity(universityId) {
            throw 'Invalid university!'
        }

        const response = await users.checkUser(universityId, username, password);

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
