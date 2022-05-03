const express = require('express');
const router = express.Router();
const data = require('../data/index');
const items = data.items;
const users = data.users;
const itemValidation = require('../data/validations/itemValidations');
const sharedValidation = require('../data/validations/sharedValidations');
const xss = require('xss');

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
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'No params provided!',
            itemsList: itemsList
        });
        return;
    }

    let itemId = params.id;
    itemId = xss(itemId);

    if (!itemId) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

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
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

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
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that item!',
            itemsList: itemsList
        });
        return;
    }

    let user;

    try {
        user = await users.getUserById(item.userId.toString());
    } catch (e) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find item owner!',
            itemsList: itemsList
        });
        return;
    }

    if (item.universityId.toString() != user.universityId.toString()) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Cannot view that item because it belongs to another school!',
            itemsList: itemsList
        });
        return;
    }

    let comments = await items.getCommentsForItemId(itemId);
    let bids = await items.getBidsForItemId(itemId, user._id);

    res.render('items/show', {
        title: item.title,
        item: item,
        canEdit: req.session.user.username == user.username,
        itemId: itemId,
        user: user,
        keywords: item.keywords.join(', '),
        comments: comments,
        bids: bids
    });
});

router.get('/:id/edit', async (req, res) => {
    let params = req.params;

    if (!params) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'No params provided!',
            itemsList: itemsList
        });
        return;
    }

    let itemId = params.id;
    itemId = xss(itemId);

    if (!itemId) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

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
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

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
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that item!',
            itemsList: itemsList
        });
        return;
    }

    let user;

    try {
        user = await users.getUserById(item.userId.toString());
    } catch (e) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find item owner!',
            itemsList: itemsList
        });
        return;
    }

    if (item.universityId.toString() != user.universityId.toString()) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Cannot view that item because it belongs to another school!',
            itemsList: itemsList
        });
        return;
    }

    if (req.session.user.username != user.username) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Cannot edit that item because you are not the owner!',
            itemsList: itemsList
        });
        return;
    }

    res.render('items/edit', {
        title: 'Edit ' + item.title,
        id: item._id,
        item_title: item.title,
        description: item.description,
        keywords: item.keywords,
        price: item.price,
        pickUpMethod: item.pickUpMethod
    });
});

router.put('/:id', async (req, res) => {
    let params = req.params;

    if (!params) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'No params provided!',
            itemsList: itemsList
        });
        return;
    }

    let itemId = params.id;
    itemId = xss(itemId);

    if (!itemId) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

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
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

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
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that item!',
            itemsList: itemsList
        });
        return;
    }

    let user;

    try {
        user = await users.getUserById(item.userId.toString());
    } catch (e) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find item owner!',
            itemsList: itemsList
        });
        return;
    }

    if (item.universityId.toString() != user.universityId.toString()) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Cannot view that item because it belongs to another school!',
            itemsList: itemsList
        });
        return;
    }

    if (req.session.user.username != user.username) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Cannot edit that item because you are not the owner!',
            itemsList: itemsList
        });
        return;
    }

    let body = req.body;

    if (!body) {
        res.status(400).render('items/edit', {
            title: 'New Item',
            error_status_code: 'HTTP 400 status code',
            error_messages: 'You must provide a body to your request',
            id: itemId
        });
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
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'No params provided!',
            itemsList: itemsList
        });
        return;
    }

    let itemId = params.id;
    itemId = xss(itemId);

    if (!itemId) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'No ID param provided!',
            itemsList: itemsList
        });
        return;
    }

    let body = req.body;

    if (!body) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'You must supply a body to your request!',
            itemsList: itemsList
        });
        return;
    }

    let { comment } = body;
    comment = xss(comment);

    if (!comment) {
        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'You must supply a comment!',
            itemsList: itemsList
        });
        return;
    }

    try {
        itemValidation.isValidComment(itemId, req.session.user.username, comment);
    } catch (e) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Your param/body is not vaild!' + e,
            itemsList: itemsList
        });
        return;
    }

    let item;

    try {
        item = await items.getItemById(itemId);
    } catch (e) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that item!',
            itemsList: itemsList
        });
        return;
    }

    let user;

    try {
        user = await users.getUserById(item.userId.toString());
    } catch (e) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find item owner!',
            itemsList: itemsList
        });
        return;
    }

    if (item.universityId.toString() != user.universityId.toString()) {
        let user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Cannot view that item because it belongs to another school!',
            itemsList: itemsList
        });
        return;
    }

    try {
        const commentResult = await items.createComment(itemId, req.session.user.username, comment);

        res.render('partials/comment', { layout: null, ...commentResult });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});
 //EDIT HERRE
router.post('/:id/bid', async (req, res) => {
    let params = req.params;
    let user;
    if (!params) {
        user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);
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
        user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'No ID param provided!',
            itemsList: itemsList
        });
        return;
    }

    let body = req.body;
    if (!body) {
        user = await users.getUser(req.session.user.username);
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'You must supply a body to your request!',
            itemsList: itemsList
        });
        return;
    }

    let { bid } = body;

    if (!bid) {
        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'You must supply a bid!',
            itemsList: itemsList
        });
        return;
    }
    try {
        user = await users.getUser(req.session.user.username);
        itemValidation.isValidBid(itemId, bid, user._id);
    } catch (e) {
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Your param/body is not vaild!' + e,
            itemsList: itemsList
        });
        return;
    }

    try {
        await items.getItemById(itemId);
    } catch (e) {
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find that item!',
            itemsList: itemsList
        });
        return;
    }
    
    try {
        user = await users.getUserById(item.userId.toString());
    } catch (e) {
        const itemsList = await items.getAllByUniversityId(user.universityId);

        res.status(404).render('index', {
            title: 'Item not found',
            error_status_code: 'HTTP 404 status code',
            error_messages: 'Could not find item owner!',
            itemsList: itemsList
        });
        return;
    }

    try {
        const bidResult = await items.createBids(itemId, bid, user._id);

        res.render('partials/bids', { layout: null, ...bidResult });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;
