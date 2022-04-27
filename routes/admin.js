const express = require('express');
const router = express.Router();
const data = require('../data/index');
const universities = data.universities;
const universityValidation = require('../data/validations/universityValidations');

router.get('/', async (req, res) => {
    const universitiesList = await universities.getAll();

    res.render('admin/index', { title: 'Unisell Admin', universities: universitiesList });
});

router.get('/universities/new', async (req, res) => {
    res.render('admin/new', { title: 'New University' });
});

router.get('/universities/:id/edit', async (req, res) => {
    let params = req.params;

    if (!params) {
        res.status(404).render('admin/index', {
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that university!'
        });
        return;
    }

    let universityId = params.id;

    if (!universityId) {
        res.status(404).render('admin/index', {
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that university!'
        });
        return;
    }

    let university = await universities.getUniversityById(universityId);

    if (!university) {
        res.status(404).render('admin/index', {
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that university!'
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
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide a body to your request'
        });
        return;
    }

    let { name, emailDomain } = body;

    if (!name || !emailDomain) {
        res.status(400).render('admin/new', {
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide both the name and emailDomain'
        });
        return;
    }

    try {
        universityValidation.isValidUniversityParameters(name, emailDomain);
    } catch (e) {
        res.status(400).render('admin/new', {
            error_status_code: 'HTTP 400 status code',
            error_messages: e,
            name: name,
            emailDomain: emailDomain
        });
        return;
    }

    try {
        await universities.createUniversity(name, emailDomain);

        res.redirect('/admin');
    } catch (e) {
        res.status(500).render('admin/new', {
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
        res.status(404).render('admin/edit', {
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that university!'
        });
        return;
    }

    let universityId = params.id;

    if (!universityId) {
        res.status(404).render('admin/edit', {
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that university!'
        });
        return;
    }

    let university = await universities.getUniversityById(universityId);

    if (!university) {
        res.status(404).render('admin/edit', {
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that university!'
        });
        return;
    }

    let body = req.body;

    if (!body) {
        res.status(400).render('admin/edit', {
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide a body to your request'
        });
        return;
    }

    let { name, emailDomain } = body;

    if (!name || !emailDomain) {
        res.status(400).render('admin/edit', {
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide both the name and emailDomain',
            name: name,
            emailDomain: emailDomain
        });
        return;
    }

    try {
        universityValidation.isValidUniversityParameters(name, emailDomain);
    } catch (e) {
        res.status(400).render('admin/edit', {
            error_status_code: 'HTTP 400 status code',
            error_messages: e,
            name: name,
            emailDomain: emailDomain
        });
        return;
    }

    try {
        await universities.updateUniversity(name, emailDomain);

        res.redirect('/admin');
    } catch (e) {
        res.status(500).render('admin/edit', {
            error_status_code: 'HTTP 500 status code',
            error_messages: e,
            name: name,
            emailDomain: emailDomain
        });
    }
});

module.exports = router;
