const express = require('express');
const router = express.Router();

const data = require('../data/index');
const users = data.users;

const validation = require('../validation');

router.get('/login', async (req, res) => {
});

router.get('/logout', async (req, res) => {

    req.session.destroy();
    res.render('auth/loggedout', {title: "Logged out"});
});

router.get('/signup', async (req, res) => {

    if (req.session.user) 
    {
        return res.redirect('/');
    }

    res.render('auth/signup', {title: "Sign Up"});
})

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;
    const imageURL = "todo";//req.body.profileImageUrl;
    const bio = req.body.bio;
    
    try
    {
        validation.isValidUserParameters(username, password, name, email, imageURL, bio);
    }
    catch (e)
    {
        res.status(400).render('auth/signup', {
            title: "Sign Up",
            error_status_code: "HTTP 400 status code",
            error_messages: e
        });
    }

    try
    {
        const response = await users.createUser(username, password, name, email, imageURL, bio);

        if (response === null || response.userInserted === false)
        {
            res.status(500).render('auth/signup', {
                title: "Sign Up",
                error_status_code: "HTTP 500 status code",
                error_messages: "Internal Server Error: " + e
            });
        }

        if (response.userInserted === true)
        {
            req.session.user = {username: username};

            res.redirect('/');
        }
    }
    catch (e)
    {
        res.status(500).render('auth/signup', {
            title: "Sign Up",
            error_status_code: "HTTP 500 status code",
            error_messages: "Internal Server Error: " + e
        });
    }
})

module.exports = router;