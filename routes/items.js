const express = require('express');
const router = express.Router();
const data = require('../data/index');
const items = data.items;

router.get('/:id', async (req, res) => {
    let params = req.params;

    if (!params) {
        res.status(404).render('errors/404', {
            title: '404',
            message: 'Could not find that item'
        });
        return;
    }

    let itemId = params.id;

    //NEED MORE HERE

    res.render('items/show', { title: 'Item for ' + itemId, itemId: itemId });
});

module.exports = router;
