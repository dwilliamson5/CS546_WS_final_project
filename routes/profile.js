const express = require('express');
const router = express.Router();
const data = require('../data/index');
const users = data.users;
const userValidation = require('../data/validations/userValidations');

router.get('/edit', async (req, res) => {
    try {
        let user = await users.getUser(req.session.user.username);

        res.render('profile/edit', {
            title: 'Edit Profile',
            username: user.username,
            name: user.name,
            email: user.email,
            bio: user.bio
        });
    } catch (e) {
        res.status(500).render('errors/500', {
            title: '500',
            message: 'Internal server error'
        });
    }
});

router.put('/edit', async (req, res) => {
    let body = req.body;

    if (!body) {
        res.status(400).render('profile/edit', {
            title: 'Edit Profile',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide a body to your request'
        });
        return;
    }

    let { username, name, email, imageURL, bio } = body;

    // this is temporary until it comes as part of the request body
    imageURL = 'todo';

    if (!username || !name || !email || !imageURL || !bio) {
        res.status(400).render('profile/edit', {
            title: 'Edit Profile',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide all the fields',
            username: username,
            name: name,
            email: email,
            bio: bio
        });
        return;
    }

    try {
        userValidation.isValidUserUpdateParameters(req.session.user.username, username, name, email, imageURL, bio);
    } catch (e) {
        res.status(400).render('profile/edit', {
            title: 'Edit Profile',
            error_status_code: 'HTTP 400 status code',
            error_messages: e,
            username: username,
            name: name,
            email: email,
            bio: bio
        });
        return;
    }

    try {
        let response = await users.updateUser(req.session.user.username, username, name, email, imageURL, bio);

        if (response === null || response.userUpdated !== true) {
            res.status(500).render('profile/edit', {
                title: 'Edit Profile',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error',
                username: username,
                name: name,
                email: email,
                bio: bio
            });
            return;
        }

        if (response.userUpdated === true) {
            // Update username since it could have changed
            req.session.user = { username: response.username };
        }

        res.redirect('/');
    } catch (e) {
        res.status(500).render('profile/edit', {
            title: 'Edit Profile',
            error_status_code: 'HTTP 500 status code',
            error_messages: e,
            username: username,
            name: name,
            email: email,
            bio: bio
        });
    }
});

router.put('/edit/password', async (req, res) => {
    let body = req.body;

    if (!body) {
        res.status(400).render('profile/edit', {
            title: 'Edit Profile',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide a body to your request'
        });
        return;
    }

    let { current_password, new_password, new_password_confirmation } = body;

    if (!current_password || !new_password || !new_password_confirmation) {
        res.status(400).render('profile/edit', {
            title: 'Edit Profile',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide the current password + new password and confirmation'
        });
        return;
    }

    try {
        userValidation.validateUpdatePassword(req.session.user.username, current_password, new_password, new_password_confirmation);
    } catch (e) {
        res.status(400).render('profile/edit', {
            title: 'Edit Profile',
            error_status_code: 'HTTP 400 status code',
            error_messages: e
        });
        return;
    }

    try {
        let response = await users.updatePassword(req.session.user.username, current_password, new_password, new_password_confirmation);

        if (response === null || response.passwordUpdated !== true) {
            res.status(500).render('profile/edit', {
                title: 'Edit Profile',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error'
            });
            return;
        }

        res.redirect('/');
    } catch (e) {
        res.status(500).render('profile/edit', {
            title: 'Edit Profile',
            error_status_code: 'HTTP 500 status code',
            error_messages: e
        });
    }
});

module.exports = router;
