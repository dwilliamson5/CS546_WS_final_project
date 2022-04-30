const express = require('express');
const router = express.Router();
const data = require('../data/index');
const items = data.items;
const itemValidation = require('../data/validations/itemValidations');
const sharedValidation = require('../data/validations/sharedValidations');

router.get('/new', async (req, res) => {
    res.render('items/new', { title: 'New Item' });
});

router.post('/', async (req, res) => {
    let body = req.body;

    if (!body) {
        res.status(400).render('items/new', {
            title: 'New Item',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide a body to your request'
        });
        return;
    }

    let { item_title, description, keywords, price, photos, pickUpMethod } = body;
    
    // temp until we get photos working
    photos = 'imag1, image2, image3';

    if (!item_title || !description || !keywords || !price || !photos || !pickUpMethod) {
        res.status(400).render('items/new', {
            title: 'New Item',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide all fields',
            item_title: item_title,
            description: description,
            keywords: keywords,
            price: price,
            pickUpMethod: pickUpMethod
        });
        return;
    }

    let username = req.session.user.username;

    try {
        itemValidation.isValidItemParameters(item_title, description, keywords, price, username, photos, pickUpMethod);
    } catch (e) {
        res.status(400).render('items/new', {
            title: 'New Item',
            error_status_code: 'HTTP 400 status code',
            error_messages: e,
            item_title: item_title,
            description: description,
            keywords: keywords,
            price: price,
            pickUpMethod: pickUpMethod
        });
        return;
    }

    try {
        let response = await items.createItem(item_title, description, keywords, price, username, photos, pickUpMethod);

        if (response === null || response.itemInserted !== true) {
            res.status(500).render('items/new', {
                title: 'New Item',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error',
                item_title: item_title,
                description: description,
                keywords: keywords,
                price: price,
                pickUpMethod: pickUpMethod
            });
            return;
        }

        res.redirect('/items/' + response.id);
    } catch (e) {
        res.status(500).render('items/new', {
            title: 'New Item',
            error_status_code: 'HTTP 500 status code',
            error_messages: e,
            item_title: item_title,
            description: description,
            keywords: keywords,
            price: price,
            pickUpMethod: pickUpMethod
        });
    }
});

router.get('/:id', async (req, res) => {
    let params = req.params;

    if (!params) {
        const itemsList = await items.getAll();

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'No params provided!',
            itemsList: itemsList
        });
        return;
    }

    let itemId = params.id;

    if (!itemId) {
        const itemsList = await items.getAll();

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'No ID param provided!',
            itemsList: itemsList
        });
        return;
    }

    try {
        sharedValidation.isValidItemId(itemId);
    } catch (e) {
        const itemsList = await items.getAll();

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Bad item ID!',
            itemsList: itemsList
        });
        return;
    }

    let item;

    try {
        item = await items.getItemById(itemId);
    } catch (e) {
        const itemsList = await items.getAll();

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that item!',
            itemsList: itemsList
        });
        return;
    }

    res.render('items/show', {
        title: 'Item for ' + itemId,
        item: item,
        itemId: itemId
    });
});

router.get('/:id/edit', async (req, res) => {
    let params = req.params;

    if (!params) {
        const itemsList = await items.getAll();

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'No params provided!',
            itemsList: itemsList
        });
        return;
    }

    let itemId = params.id;

    if (!itemId) {
        const itemsList = await items.getAll();

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'No ID param provided!',
            itemsList: itemsList
        });
        return;
    }

    try {
        sharedValidation.isValidItemId(itemId);
    } catch (e) {
        const itemsList = await items.getAll();

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Bad item ID!',
            itemsList: itemsList
        });
        return;
    }

    let item;

    try {
        item = await items.getItemById(itemId);
    } catch (e) {
        const itemsList = await items.getAll();

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that item!',
            itemsList: itemsList
        });
        return;
    }

    if (req.session.user.username != item.userId.toString()) {
        const itemsList = await items.getAll();

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Cannot edit that item because you are not the owner!',
            itemsList: itemsList
        });
        return;
    }

    res.render('items/edit', {
        title: 'Edit ' + university.name,
        id: item._id,
        item_title: item.title,
        // emailDomain: university.emailDomain
    });
});

//update


//create comments

// need to check that the user is the owner or admin 

//mark as sold

module.exports = router;
