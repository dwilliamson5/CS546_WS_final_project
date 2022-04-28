const { ObjectId } = require('mongodb');

function isValidString(string) {
    if (string === undefined ||
        typeof string !== 'string' ||
        string.trim().length === 0) {
        return false;
    }

    return true;
}

function isValidPrice(price) {
    if(price < 0){
        return false;
    }
    return true;
}

function isValidOjbectId(id){
    if (!ObjectId.isValid(id)) {
        return false;
    }
    return true;
}

function isValidBoolean(bool){
    if(typeof bool != 'boolean'){
        return false;
    }
    return true;
}

function isValidCreateBids(itemId, bid, userId, accepted){
    if(typeof accepted != 'boolean'){
        throw 'Invalid bid status';
    }
    if (!isValidOjbectId(userId)) {
        throw 'Invalid user ID!';
    }
    if (!isValidOjbectId(itemId)) {
        throw 'Invalid item ID!';
    }
    if(!isValidPrice(bid)){
        throw 'Invalid bid!';
    }
    return true;
}

function isValidCreateComment(itemId, comment, userId) {
    if (!isValidOjbectId(userId)) {
        throw 'Invalid user ID!';
    }
    if (!isValidOjbectId(itemId)) {
        throw 'Invalid item ID!';
    }
    if(!isValidString(comment)){
        throw 'Invalid comment!';
    }
    return true;
}

function isValidCreateRating(itemId, rating, userId) {
    if (!isValidOjbectId(userId)) {
        throw 'Invalid user ID!';
    }
    if (!isValidOjbectId(itemId)) {
        throw 'Invalid item ID!';
    }
    if(typeof rating != 'number'){
        throw 'Invalid rating!';
    }
    if(rating < 0 || rating > 5){
        throw 'Invalid rating!';
    }
    return true;
}

async function isValidItemParameters(title, description, keywords, price, sold, userId, universtiyId, pickup_method, photos, bids, comments) {
    if (!isValidString(title)) {
        throw 'Invalid title!';
    }
    if (!isValidString(description)) {
        throw 'Invalid description!';
    }
    if (!Array.isArray(keywords)) {
        throw 'Invalid keywords!';
    }
    if (!isValidString(pickup_method)) {
        throw 'Invalid pickup_method!';
    }
    if (!Array.isArray(comments)) {
        throw 'Invalid comments!';
    }
    //images
    if (!Array.isArray(photos)) {
        throw 'Invalid photos!';
    }
    //check prices
    if(!isValidPrice(price)){
        throw 'Invalid price!';
    }
    if(!Array.isArray(bids)){
        throw 'Invalid price!';
    }
    //check if sold
    if (!isValidBoolean(sold)) {
        throw 'Invalid item status!';
    }
    //check object ID
    if (!isValidOjbectId(userId)) {
        throw 'Invalid user ID!';
    }
    if (!isValidOjbectId(universtiyId)) {
        throw 'Invalid university ID!';
    }
    return true;
}

module.exports = {
    isValidString,
    isValidPrice,
    isValidOjbectId,
    isValidCreateComment,
    isValidCreateBids,
    isValidCreateRating,
    isValidItemParameters
};
