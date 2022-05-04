const express = require('express');
const router = express.Router();
const data = require('../data/index');
const items = data.items;
const users = data.users;
const itemValidation = require('../data/validations/itemValidations');
const sharedValidation = require('../data/validations/sharedValidations');
const xss = require('xss');

router.get('/new', async (req, res) => {
    res.render('items/new', { title: 'New Item', flash: req.flash('message') });
});

router.post('/', async (req, res) => {
    let body = req.body;

    if (!body) {
        req.flash('message', 'You must provide a body to your request');
        res.redirect('/items/new');
        return;
    }

    let { item_title, description, keywords, price, photos, pickUpMethod } = body;
    item_title = xss(item_title);
    description = xss(description);
    keywords = xss(keywords);
    price = xss(price);
    photos = xss(photos);
    pickUpMethod = xss(pickUpMethod);

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
        req.flash('message', 'No params provided!');
        res.redirect('/');
        return;
    }

    let itemId = params.id;
    itemId = xss(itemId);

    if (!itemId) {
        req.flash('message', 'No ID param provided!');
        res.redirect('/');
        return;
    }

    try {
        sharedValidation.isValidItemId(itemId);
    } catch (e) {
        req.flash('message', 'Bad item ID!');
        res.redirect('/');
        return;
    }

    let item;

    try {
        item = await items.getItemById(itemId);
    } catch (e) {
        req.flash('message', 'Could not find that item!');
        res.redirect('/');
        return;
    }

    let user;

    try {
        user = await users.getUserById(item.userId.toString());
    } catch (e) {
        req.flash('message', 'Could not find item owner!');
        res.redirect('/');
        return;
    }

    if (item.universityId.toString() != user.universityId.toString()) {
        req.flash('message', 'Cannot view that item because it belongs to another school!');
        res.redirect('/');
        return;
    }

    let comments = await items.getCommentsForItemId(itemId);
    let currentUser = await users.getUser(req.session.user.username);
    let itemPostUser = await users.getUserById(item.userId);

    if(currentUser._id == item.userId){  //current user is the seller
        let bids = await items.getBidsForSeller(itemId.toString());
        res.render('items/show', {
            title: item.title,
            item: item,
            canEdit: req.session.user.username == user.username,
            itemId: itemId,
            user: itemPostUser,
            keywords: item.keywords.join(', '),
            comments: comments,
            bids: bids
        });
        return;
    }
    else{ //current user posted a bid already
        let bids = await items.getBidsForBuyer(itemId.toString(), currentUser._id.toString());
        if(bids == []){
            res.render('items/show', {
                title: item.title,
                item: item,
                canEdit: req.session.user.username == user.username,
                itemId: itemId,
                user: itemPostUser,
                keywords: item.keywords.join(', '),
                comments: comments,
            });
            return;
        } 
        else{//current user has no bids
            res.render('items/show', {
                title: item.title,
                item: item,
                canEdit: req.session.user.username == user.username,
                itemId: itemId,
                user: itemPostUser,
                keywords: item.keywords.join(', '),
                comments: comments,
                bids: bids
            });
            return;
        }
    }
});

router.get('/:id/edit', async (req, res) => {
    let params = req.params;

    if (!params) {
        req.flash('message', 'No params provided!');
        res.redirect('/');
        return;
    }

    let itemId = params.id;
    itemId = xss(itemId);

    if (!itemId) {
        req.flash('message', 'No ID param provided!');
        res.redirect('/');
        return;
    }

    try {
        sharedValidation.isValidItemId(itemId);
    } catch (e) {
        req.flash('message', 'Bad item ID!');
        res.redirect('/');
        return;
    }

    let item;

    try {
        item = await items.getItemById(itemId);
    } catch (e) {
        req.flash('message', 'Could not find that item!');
        res.redirect('/');
        return;
    }

    let user;

    try {
        user = await users.getUserById(item.userId.toString());
    } catch (e) {
        req.flash('message', 'Could not find item owner!');
        res.redirect('/');
        return;
    }

    if (item.universityId.toString() != user.universityId.toString()) {
        req.flash('message', 'Cannot view that item because it belongs to another school!');
        res.redirect('/');
        return;
    }

    if (req.session.user.username != user.username) {
        req.flash('message', 'Cannot edit that item because you are not the owner!');
        res.redirect('/');
        return;
    }

    res.render('items/edit', {
        title: 'Edit ' + item.title,
        id: item._id,
        item_title: item.title,
        description: item.description,
        keywords: item.keywords,
        price: item.price,
        pickUpMethod: item.pickUpMethod,
        flash: req.flash('message')
    });
});

router.put('/:id', async (req, res) => {
    let params = req.params;

    if (!params) {
        req.flash('message', 'No params provided!');
        res.redirect('/');
        return;
    }

    let itemId = params.id;
    itemId = xss(itemId);

    if (!itemId) {
        req.flash('message', 'No ID param provided!');
        res.redirect('/');
        return;
    }

    try {
        sharedValidation.isValidItemId(itemId);
    } catch (e) {
        req.flash('message', 'Bad item ID!');
        res.redirect('/');
        return;
    }

    let item;

    try {
        item = await items.getItemById(itemId);
    } catch (e) { 
        req.flash('message', 'Could not find that item!');
        res.redirect('/');
        return;
    }

    let user;

    try {
        user = await users.getUserById(item.userId.toString());
    } catch (e) {
        req.flash('message', 'Could not find item owner!');
        res.redirect('/');
        return;
    }

    if (item.universityId.toString() != user.universityId.toString()) {
        req.flash('message', 'Cannot view that item because it belongs to another school!');
        res.redirect('/');
        return;
    }

    if (req.session.user.username != user.username) {
        req.flash('message', 'Cannot edit that item because you are not the owner!');
        res.redirect('/');
        return;
    }

    let body = req.body;

    if (!body) {
        req.flash('message', 'You must provide a body to your request');
        res.redirect('/items/' + itemId);
        return;
    }

    let { item_title, description, keywords, price, photos, pickUpMethod, sold } = body;
    item_title = xss(item_title);
    description = xss(description);
    keywords = xss(keywords);
    price = xss(price);
    photos = xss(photos);
    pickUpMethod = xss(pickUpMethod);
    sold = xss(sold);

    // temp until we have photos
    photos = 'item1, item2, item3';

    if (!item_title || !description || !keywords || !price || !photos || !pickUpMethod || !sold) {
        res.status(400).render('items/edit', {
            title: 'Edit',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide all attributes',
            id: itemId,
            item_title: item_title,
            description: description,
            keywords: keywords,
            price: price,
            photos: photos,
            pickUpMethod: pickUpMethod,
            sold: sold
        });
        return;
    }

    try {
        itemValidation.isValidItemUpdateParameters(itemId, item_title, description, keywords, price, photos, pickUpMethod, sold);
    } catch (e) {
        res.status(400).render('items/edit', {
            title: 'Edit',
            error_status_code: 'HTTP 400 status code',
            error_messages: e,
            id: itemId,
            item_title: item_title,
            description: description,
            keywords: keywords,
            price: price,
            photos: photos,
            pickUpMethod: pickUpMethod,
            sold: sold
        });
        return;
    }

    try {
        let response = await items.updateItem(itemId, item_title, description, keywords, price, photos, pickUpMethod, sold);

        if (response === null || response.itemUpdated !== true) {
            res.status(500).render('items/edit', {
                title: 'Edit',
                error_status_code: 'HTTP 500 status code',
                error_messages: 'Internal Server Error',
                id: itemId,
                item_title: item_title,
                description: description,
                keywords: keywords,
                price: price,
                photos: photos,
                pickUpMethod: pickUpMethod,
                sold: sold
            });
            return;
        }

        res.redirect('/items/' + itemId);
    } catch (e) {
        res.status(500).render('items/edit', {
            title: 'Edit',
            error_status_code: 'HTTP 500 status code',
            error_messages: e,
            id: itemId,
            item_title: item_title,
            description: description,
            keywords: keywords,
            price: price,
            photos: photos,
            pickUpMethod: pickUpMethod,
            sold: sold
        });
    }
});

router.post('/:id/comment', async (req, res) => {
    let params = req.params;

    if (!params) {
        req.flash('message', 'No params provided!');
        res.redirect('/');
        return;
    }

    let itemId = params.id;
    itemId = xss(itemId);

    if (!itemId) {
        req.flash('message', 'No ID param provided!');
        res.redirect('/');
        return;
    }

    let body = req.body;

    if (!body) {
        req.flash('message', 'You must supply a body to your request!');
        res.redirect('/');
        return;
    }

    let { comment } = body;
    comment = xss(comment);

    if (!comment) {
        req.flash('message', 'You must supply a comment!');
        res.redirect('/');
        return;
    }

    try {
        itemValidation.isValidComment(itemId, req.session.user.username, comment);
    } catch (e) {
        req.flash('message', 'Your param/body is not vaild!');
        res.redirect('/');
        return;
    }

    let item;

    try {
        item = await items.getItemById(itemId);
    } catch (e) {
        req.flash('message', 'Could not find that item!');
        res.redirect('/');
        return;
    }

    let user;

    try {
        user = await users.getUserById(item.userId.toString());
    } catch (e) {
        req.flash('message', 'Could not find item owner!');
        res.redirect('/');
        return;
    }

    if (item.universityId.toString() != user.universityId.toString()) {
        req.flash('message', 'Cannot view that item because it belongs to another school!');
        res.redirect('/');
        return;
    }

    try {
        const commentResult = await items.createComment(itemId, req.session.user.username, comment);

        res.render('partials/comment', { layout: null, ...commentResult });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/:id/bid', async (req, res) => {
    let params = req.params;
    let user = await users.getUser(req.session.user.username);
    if (!params) {
        req.flash('message', 'No params provided!');
        res.redirect('/');
        return;
    }
    let itemId = params.id;
    itemId = xss(itemId);

    if (!itemId) {
        req.flash('message', 'No ID param provided!');
        return;
    }

    let body = req.body;
    if (!body) {
        req.flash('message', 'You must supply a body to your request!');
        return;
    }

    let { bid } = body;
    bid = xss(bid);

    if (!bid) {
        req.flash('message', 'You must supply a bid!');
        return;
    }

    let item;
    try {
        itemValidation.isValidBid(itemId, bid, user._id);
    } catch (e) {
        req.flash('message', 'Your param/body is not vaild!');
        return;
    }
    try {
        item = await items.getItemById(itemId);
    } catch (e) {
        req.flash('message', 'Could not find that item!');
        return;
    }

    try {
        user = await users.getUserById(item.userId.toString());
    } catch (e) {
        req.flash('message', 'Could not find item owner!');
        return;
    }
    if (item.universityId.toString() != user.universityId.toString()) {
        req.flash('message', 'Cannot view that item because it belongs to another school!');
        return;
    }
    try {
        user = await users.getUser(req.session.user.username);
        const bidResult = await items.createBids(itemId, bid, user._id);
        res.render('partials/comment', { layout: null, ...bidResult });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});
module.exports = router;
