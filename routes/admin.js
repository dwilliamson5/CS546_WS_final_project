const express = require('express');
const router = express.Router();
const data = require('../data/index');
const universities = data.universities;
const validation = require('../data/validations/universityValidations');

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
        res.status(404).render('errors/404', {
            message: 'Could not find that university'
        });
        return;
    }

    let universityId = params.id;

    let university = await universities.getUniversityById(universityId);

    if (!university) {
        res.status(404).render('errors/404', {
            message: 'Could not find that university'
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
        // NEED TO LOAD THE NEW PAGE AGAIN WITH ERROR

        res.status(400).render('errors/400', {
            message: 'You must provide a body to your request'
        });
        return;
    }

    let { name, emailDomain } = body;

    if (!name || !emailDomain) {
        // NEED TO LOAD THE NEW PAGE AGAIN WITH ERROR

        res.status(400).render('errors/400', {
            message: 'You must provide both the name and emailDomain'
        });
        return;
    }

    try {
        validation.isValidUniversityParameters(name.trim(), emailDomain.trim());
    } catch (e) {
        // NEED TO LOAD THE NEW PAGE AGAIN WITH ERROR

        res.status(400).render('errors/400', {
            message: e
        });
        return;
    }

    try {
        let university = await universities.createUniversity(name, emailDomain);

        res.redirect('/admin');
    } catch (e) {
        // NEED TO LOAD THE NEW PAGE AGAIN WITH ERROR
        // res.status(500).render('error', {
        //     error_message: 'Something went wrong. Please try again.',
        //     title: 'Oops 500',
        //     class_name: 'error'
        // });
    }
});

router.put('/:id', async (req, res) => {
    // update university, redirect to index once done
});

router.delete('/:id', async (req, res) => {
    // delete university, redirect to index once done
});

module.exports = router;