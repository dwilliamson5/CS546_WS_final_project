const mongoCollections = require('../config/mongoCollections');
const items = mongoCollections.items;
const sharedValidation = require('./validations/sharedValidations');
const validation = require('./validations/itemValidations');
const { ObjectId } = require('mongodb');

/**
 * Adds a user to the Users collection.
 *
 * @param {String} title
 * @param {String} description
 * @param {array} keywords
 * @param {number} price
 * @param {boolean} sold
 * @param {objectId} userId
 * @param {objectId} universityId
 * @param {String} pickup_method
 * @param {Sub-document} bids
 * @param {Sub-document} photos //to do
 * @param {Sub-document} comments
 * @param {Sub-document} rating
 * @returns An object containing { itemInserted: true } if successful.
 * @throws Will throw if parameters are invalid or there is an issue with the db.
 */
async function createItem(title, description, keywords, price, sold, userId, universtiyId, pickup_method, photos, bids, comments) {
    sharedValidation.checkArgumentLength(arguments, 11);
    validation.isValidItemParameters(title, description, keywords, price, sold, userId, universtiyId, pickup_method, photos, bids, comments);

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
    sharedValidation.checkArgumentLength(arguments, 4);
    validation.isValidCreateBids(itemId, bid, userId, accepted);
    const itemsCollection = await items();
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
    sharedValidation.checkArgumentLength(arguments, 3);
    validation.isValidCreateComment(itemId, comment, userId);
    const itemsCollection = await items();
    const newComment = {
        comment: comment,
        userId: userId
    };
    const updateInfo = await itemsCollection.updateOne({ _id: itemId }, { $push: { comments: newComment } });
    if (updateInfo.modifiedCount === 0) throw 'Could not add comment';

    return await this.getItem(itemId);
}

async function createRating(itemId, rating, userId) {
    sharedValidation.checkArgumentLength(arguments, 3);
    validation.isValidCreateRating(itemId, rating, userId);
    const itemsCollection = await items();
    const newRating = {
        userId: userId,
        rating: rating
    };
    const updateInfo = await itemsCollection.updateOne({ _id: itemId }, { $push: { ratings: newRating } });
    if (updateInfo.modifiedCount === 0) throw 'Could not add rating';

    return await this.getItem(itemId);
}
async function getItem(itemId){
    if(!validation.isValidOjbectId(itemId)){
        throw 'Invalid item ID!';
    }
    const itemsCollection = await items();
    const item = await itemsCollection.findOne({ _id: ObjectId(itemId) });
  if (!item) {
    throw 'Item does not exist!';
  }
  return item;
}
module.exports = {
    createItem,
    createBids,
    createComment, 
    getItem,
    createRating
};