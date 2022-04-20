const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('admin/index', { title: 'Unisell Admin', universities: [] });
});

router.get('/new', async (req, res) => {
    res.render('admin/new', { title: 'New University' });
});

router.get('/edit/:id', async (req, res) => {
    // find university. Redirect if it doesnt exist
    res.render('admin/new', { title: 'Edit University' });
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