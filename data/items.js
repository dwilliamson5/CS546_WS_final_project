const mongoCollections = require('../config/mongoCollections');
const items = mongoCollections.items;

async function createItem(title, description, keywords, price, sold, userId, universtiyId, pickup_method, photos, bids, comments) {
    const itemsCollection = await items();
    const newItem = {
        title: title,
        description: description,
        keywords: keywords,
        price: price,
        sold: sold,
        userId: userId,
        universityId: universtiyId,
        pickup_method: pickup_method,
        photos: photos,
        bids: bids,
        comments: comments,
    };

    const insertInfo = await itemsCollection.insertOne(newItem);
    if (insertInfo.insertedCount === 0) throw 'Could not add item';
    const newId = insertInfo.insertedId;

    return await this.getItem(newId);
}

async function createBids(itemId, bid, userId, accepted) {
    const itemsCollection = await items();
    const item = await this.getItem(itemId);
    const newBid = {
        bid: bid,
        userId: userId,
        accepted: accepted
    };
    const updateInfo = await itemsCollection.updateOne({ _id: itemId }, { $push: { bids: newBid } });
    if (updateInfo.modifiedCount === 0) throw 'Could not add bid';

    return await this.getItem(itemId);
}

async function createComment(itemId, comment, userId) {
    const itemsCollection = await items();
    const item = await this.getItem(itemId);
    const newComment = {
        comment: comment,
        userId: userId
    };
    const updateInfo = await itemsCollection.updateOne({ _id: itemId }, { $push: { comments: newComment } });
    if (updateInfo.modifiedCount === 0) throw 'Could not add comment';

    return await this.getItem(itemId);
}

async function createRating(itemId, rating, userId) {
    const itemsCollection = await items();
    const item = await this.getItem(itemId);
    const newRating = {
        userId: userId,
        rating: rating
    };
    const updateInfo = await itemsCollection.updateOne({ _id: itemId }, { $push: { ratings: newRating } });
    if (updateInfo.modifiedCount === 0) throw 'Could not add rating';

    return await this.getItem(itemId);
}

module.exports = {
    createItem,
    createBids,
    createComment, 
    createRating
};