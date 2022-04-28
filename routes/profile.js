const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const data = require('../data/index');
const users = data.users;
const universities = data.universities;

const validation = require('../data/validations/userValidations');

router.get('/edit', async (req, res) => {

    try {
        let user = await users.getUser(req.session.user.username);

        if (user === null) {
            res.status(404).render('errors/404', {
                message: 'Could not find that user'
            });
            return;
        }

        const universitiesList = await universities.getAll();

        res.render('profile/edit', { 
            title: 'Edit User', 
            universities: universitiesList, 
            user: user 
        });
    } catch (e) {
        res.status(500).render('errors/500', {
            message: 'Internal server error'
        });
        return;
    }
});

router.post('/edit/', async (req, res) => {
    let body = req.body;

    let shouldUpdatePassword = false;
    const user = await users.getUser(req.session.user.username);

    if (!body) {
        res.status(400).render('profile/edit', {
            title: 'Edit User',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide a body to your request',
            user: user
        });
        return;
    }

    let { username, password, passwordConfirm, name, email, image, bio } = body;
    let existingUsername = req.session.user.username;
    image = 'todo'; // TODO

    if (!username || !name || !email || !image || !bio) {
        res.status(400).render('profile/edit', {
            title: 'Edit User',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide all required parameters',
            user: user
        });
        return;
    }

    try {
        shouldUpdatePassword = await validation.shouldUpdatePassword(password, passwordConfirm);

        await validation.isValidUserUpdateParameters(existingUsername, username, name, email, image, bio);

        let university = await universities.getUniversityById(ObjectId(user.universityId));
        let emailDomain = email.trim().split('@')[1];

        if (university.emailDomain != emailDomain) {
            throw 'Email domain does not match selected university domain!';
        }

        if (existingUsername !== username) {
            // Check if user already exists
            if (await users.getUser(username) !== null) {
                throw 'The new username is already in use!';
            }
        }
    } catch (e) {
        res.status(400).render('profile/edit', {
            title: 'Edit User',
            error_status_code: 'HTTP 400 status code',
            error_messages: e,
            user: user
        });
        return;
    }

    try {
        let updateResponse = await users.updateUser(existingUsername, username, name, email, image, bio);

        if (updateResponse === null || updateResponse.userUpdated !== true) {
            res.status(500).render('profile/edit', {
                title: 'Edit User',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error',
                user: user
            });
            return;
        }

        if (updateResponse.userUpdated === true) {
            // Update username since it could have changed
            req.session.user = { username: username };
        }

        if (shouldUpdatePassword) {
            let passwordResponse = await users.updatePassword(username, password);

            if (passwordResponse === null || passwordResponse.passwordUpdated !== true) {
                res.status(500).render('profile/edit', {
                    title: 'Edit User',
                    error_status_code: 'HTTP 500 status code',
                    error_messages: 'Internal Server Error',
                    user: user
                });
                return;
            }
        }

        res.redirect('/');
    } catch (e) {
        res.status(500).render('errors/500', {
            message: 'Internal server error' + e
        });
        return;
    }
});

module.exports = router; 