const express = require('express');
const router = express.Router();
const data = require('../data/index');
const users = data.users;
const universities = data.universities;
const validation = require('../data/validations/userValidations');
const { ObjectId } = require('mongodb');

router.get('/login', async (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }

    const universitiesList = await universities.getAll();

    res.render('auth/login', { title: 'Login', universities: universitiesList });
});

router.post('/login', async (req, res) => {
    const universityId = req.body.universityId;
    const username = req.body.username;
    const password = req.body.password;
    const universitiesList = await universities.getAll();

    try {
        if (!validation.isValidUsername(username) ||
            !validation.isValidPassword(password)) {
            throw 'Invalid username or password!'
        }

        if (!validation.isValidUniversityId(universityId)) {
            throw 'Invalid university!'
        }

        const response = await users.checkUser(universityId, username, password);

        if (response === null || response.authenticated !== true) {
            return res.status(500).render('auth/login', {
                title: 'Login',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error',
                universities: universitiesList
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
            error_messages: e,
            universities: universitiesList
        });
    }
})

router.get('/signup', async (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }

    const universitiesList = await universities.getAll();

    res.render('auth/signup', { title: 'Sign Up', universities: universitiesList });
})

router.post('/signup', async (req, res) => {
    const universityId = req.body.universityId;
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;
    const imageURL = 'todo';//req.body.profileImageUrl;
    const bio = req.body.bio;
    const universitiesList = await universities.getAll();

    try {
        // Check parameters
        await validation.isValidUserParameters(universityId, username, password, name, email, imageURL, bio);

        let university = await universities.getUniversityById(ObjectId(universityId));

        //get Email domain
        let emailDomain = email.trim().split('@')[1];

        if (university.emailDomain != emailDomain) {
            throw 'Email domain does not match selected university domain!';
        }

        // Check if user already exists
        if (await users.getUser(username) !== null) {
            throw 'That username already exists!';
        }
    } catch (e) {
        return res.status(400).render('auth/signup', {
            title: 'Sign Up',
            error_status_code: 'HTTP 400 status code',
            error_messages: e,
            universities: universitiesList
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

router.get('/logout', async (req, res) => {
    if (req.session.user) {
        req.session.destroy();

        res.render('auth/loggedout', { title: 'Logged out' });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
