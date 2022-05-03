const express = require('express');
const router = express.Router();
const data = require('../data/index');
const universities = data.universities;
const universityValidation = require('../data/validations/universityValidations');
const sharedValidation = require('../data/validations/sharedValidations');
const xss = require('xss');

router.get('/', async (req, res) => {
    const universitiesList = await universities.getAll();

    res.render('admin/index', { title: 'Unisell Admin', universitiesList: universitiesList });
});

router.get('/universities/new', async (req, res) => {
    res.render('admin/new', { title: 'New University' });
});

router.get('/universities/:id/edit', async (req, res) => {
    let params = req.params;

    if (!params) {
        const universitiesList = await universities.getAll();

        res.status(404).render('admin/index', {
            error_status_code: 'HTTP 404 status code',
            error_messages: 'No params provided!',
            universitiesList: universitiesList
        });
        return;
    }

    let universityId = params.id;
    universityId = xss(universityId);

    if (!universityId) {
        const universitiesList = await universities.getAll();

        res.status(404).render('admin/index', {
            error_status_code: 'HTTP 404 status code',
            error_messages: 'No ID param provided!',
            universitiesList: universitiesList
        });
        return;
    }

    try {
        sharedValidation.isValidUniversityId(universityId);
    } catch (e) {
        const universitiesList = await universities.getAll();

        res.status(404).render('admin/index', {
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Bad university ID!',
            universitiesList: universitiesList
        });
        return;
    }

    let university;

    try {
        university = await universities.getUniversityById(universityId);
    } catch (e) {
        const universitiesList = await universities.getAll();

        res.status(404).render('admin/index', {
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that university!',
            universitiesList: universitiesList
        });
        return;
    }

    res.render('admin/edit', {
        title: 'Edit ' + university.name,
        id: university._id,
        name: university.name,
        emailDomain: university.emailDomain
    });
});

router.post('/universities/', async (req, res) => {
    let body = req.body;

    if (!body) {
        res.status(400).render('admin/new', {
            title: 'New University',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide a body to your request'
        });
        return;
    }

    let { name, emailDomain } = body;
    name = xss(name);
    emailDomain = xss(emailDomain);

    if (!name || !emailDomain) {
        res.status(400).render('admin/new', {
            title: 'New University',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide both the name and emailDomain'
        });
        return;
    }

    try {
        universityValidation.isValidUniversityParameters(name, emailDomain);
    } catch (e) {
        res.status(400).render('admin/new', {
            title: 'New University',
            error_status_code: 'HTTP 400 status code',
            error_messages: e,
            name: name,
            emailDomain: emailDomain
        });
        return;
    }

    try {
        let response = await universities.createUniversity(name, emailDomain);

        if (response === null || response.universityInserted !== true) {
            res.status(500).render('admin/new', {
                title: 'New University',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error',
                name: name,
                emailDomain: emailDomain
            });
            return;
        }

        res.redirect('/admin');
    } catch (e) {
        res.status(500).render('admin/new', {
            title: 'New University',
            error_status_code: 'HTTP 500 status code',
            error_messages: e,
            name: name,
            emailDomain: emailDomain
        });
    }
});

router.put('/universities/:id', async (req, res) => {
    let params = req.params;

    if (!params) {
        const universitiesList = await universities.getAll();

        res.status(404).render('admin/index', {
            title: '404',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that university!',
            universitiesList: universitiesList
        });
        return;
    }

    let universityId = params.id;
    universityId = xss(universityId);

    if (!universityId) {
        const universitiesList = await universities.getAll();

        res.status(404).render('admin/index', {
            title: '404',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that university!',
            universitiesList: universitiesList
        });
        return;
    }

    let university = await universities.getUniversityById(universityId);

    if (!university) {
        const universitiesList = await universities.getAll();

        res.status(404).render('admin/index', {
            title: '404',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that university!',
            universitiesList: universitiesList
        });
        return;
    }

    let body = req.body;

    if (!body) {
        res.status(400).render('admin/edit', {
            title: 'Edit',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide a body to your request',
            id: universityId
        });
        return;
    }

    let { name, emailDomain } = body;
    name = xss(name);
    emailDomain = xss(emailDomain);

    if (!name || !emailDomain) {
        res.status(400).render('admin/edit', {
            title: 'Edit',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide both the name and emailDomain',
            name: name,
            emailDomain: emailDomain,
            id: universityId
        });
        return;
    }

    try {
        sharedValidation.isValidUniversityId(universityId);
        universityValidation.isValidUniversityParameters(name, emailDomain);
    } catch (e) {
        res.status(400).render('admin/edit', {
            title: 'Edit',
            error_status_code: 'HTTP 400 status code',
            error_messages: e,
            name: name,
            emailDomain: emailDomain,
            id: universityId
        });
        return;
    }

    try {
        let response = await universities.updateUniversity(universityId, name, emailDomain);

        if (response === null || response.universityUpdated !== true) {
            res.status(500).render('admin/edit', {
                title: 'Edit',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error',
                name: name,
                emailDomain: emailDomain,
                id: universityId
            });
            return;
        }

        res.redirect('/admin');
    } catch (e) {
        res.status(500).render('admin/edit', {
            title: 'Edit',
            error_status_code: 'HTTP 500 status code',
            error_messages: e,
            name: name,
            emailDomain: emailDomain,
            id: universityId
        });
    }
});

module.exports = router;
