const express = require('express');
const router = express.Router();
const data = require('../data/index');
const universities = data.universities;
const validation = require('../data/validations/universityValidations');

router.get('/', async (req, res) => {
    const universitiesList = await universities.getAll();

    res.render('admin/index', { title: 'Unisell Admin', universities: universitiesList });
});

router.get('/new', async (req, res) => {
    res.render('admin/new', { title: 'New University' });
});

router.get('/edit/:id', async (req, res) => {
    // find university. Redirect if it doesnt exist
    res.render('admin/edit', { title: 'Edit University' });
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