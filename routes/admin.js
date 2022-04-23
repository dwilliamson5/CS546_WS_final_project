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

router.post('/', async (req, res) => {
    // create university, redirect to index once done
});

router.put('/:id', async (req, res) => {
    // update university, redirect to index once done
});

router.delete('/:id', async (req, res) => {
    // delete university, redirect to index once done
});

module.exports = router;