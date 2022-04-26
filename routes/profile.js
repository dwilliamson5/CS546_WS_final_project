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

    const universitiesList = await universities.getAll();
    const user = await users.getUser(req.session.user.username);

    if (!body) {
        res.status(400).render('profile/edit', {
            title: 'Edit User',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide a body to your request',
            universities: universitiesList,
            user: user
        });
        return;
    }

    let { universityId, username, name, email, image, bio } = body;
    let existingUsername = req.session.user.username;
    image = 'todo'; // TODO

    if (!universityId || !username || !name || !email || !image || !bio) {
        res.status(400).render('profile/edit', {
            title: 'Edit User',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide all required parameters',
            universities: universitiesList,
            user: user
        });
        return;
    }

    try {
        await validation.isValidUserUpdateParameters(universityId, existingUsername, username, name, email, image, bio);

        let university = await universities.getUniversityById(ObjectId(universityId));

        //get Email domain
        let emailDomain = email.trim().split('@')[1];

        if (university.emailDomain != emailDomain) {
            throw 'Email domain does not match selected university domain!';
        }
    } catch (e) {
        res.status(400).render('profile/edit', {
            title: 'Edit User',
            error_status_code: 'HTTP 400 status code',
            error_messages: e,
            universities: universitiesList,
            user: user
        });
        return;
    }

    try {
        let response = await users.updateUser(universityId, existingUsername, username, name, email, image, bio);

        if (response === null || response.userUpdated !== true) {
            res.status(500).render('profile/edit', {
                title: 'Edit User',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error',
                universities: universitiesList,
                user: user
            });
            return;
        }

        if (response.userUpdated === true) {
            // Update username since it could have changed
            req.session.user = { username: username };

            res.redirect('/');
        }
    } catch (e) {
        res.status(500).render('errors/500', {
            message: 'Internal server error'
        });
        return;
    }
});

module.exports = router; 