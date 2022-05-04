const express = require('express');
const router = express.Router();
const data = require('../data/index');
const items = data.items;
const users = data.users;
const universities = data.universities;
const sharedValidation = require('../data/validations/sharedValidations');
const xss = require('xss');

router.post('/', async (req, res) => {
    let body = req.body;

    if (!body) {
        res.status(400).render('search/index', {
            title: 'Search',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide a body to your request'
        });
        return;
    }

    let { search_term } = body;
    search_term = xss(search_term);

    if (!search_term) {
        res.status(400).render('search/index', {
            title: 'Search',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide all fields'
        });
        return;
    }

    let id;
    let user = await users.getUser(req.session.user.username);

    try {
        id = sharedValidation.isValidUniversityId(user.universityId);
        sharedValidation.checkIsString(search_term);
        search_term = sharedValidation.cleanUpString(search_term);
        sharedValidation.checkStringLength(search_term, 'search_term');
    } catch (e) {
        res.status(400).render('search/index', {
            title: 'Search',
            error_status_code: 'HTTP 400 status code',
            error_messages: e
        });
        return;
    }

    try {
        let response = await items.getAllByUniversityIdAndKeyword(id, search_term);

        if (response === null) {
            res.status(500).render('search/index', {
                title: 'Search',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error'
            });
            return;
        }

        res.render('search/index', {
            title: 'Search Results for ' + search_term,
            itemsList: response,
            searchTerm: search_term
        });
    } catch (e) {
        res.status(500).render('search/index', {
            title: 'Search',
            error_status_code: 'HTTP 500 status code',
            error_messages: e
        });
    }
});

module.exports = router;
