const mongoCollections = require('../config/mongoCollections');
const items = mongoCollections.items;
const users = require('./users');
const itemValidation = require('./validations/itemValidations');
const sharedValidation = require('./validations/sharedValidations');
const { ObjectId } = require('mongodb');

async function getAllByUniversityId(id) {
    sharedValidation.checkArgumentLength(arguments, 1);
    id = sharedValidation.isValidUniversityId(id);

    const itemCollection = await items();
    let itemList = await itemCollection.find({ sold: false, universityId: id }).toArray();

    if (!itemList) {
        throw 'Could not get all items';
    }

    itemList.forEach(item => {
      item._id = sharedValidation.stringifyId(item._id);
    });

    return itemList;
}

async function getItemById(id) {
  sharedValidation.checkArgumentLength(arguments, 1);
  id = sharedValidation.isValidItemId(id);

  const itemCollection = await items();
  const item = await itemCollection.findOne({ _id: ObjectId(id) });

  if (!item) {
    throw 'Item does not exist!'
  }

  item._id = item._id.toString();

  return item;
}

async function createItem(title, description, keywords, price, username, photos, pickUpMethod) {
  sharedValidation.checkArgumentLength(arguments, 7);

  let sanitizedData = itemValidation.isValidItemParameters(title, description, keywords, price, username, photos, pickUpMethod);

  let user = await users.getUser(sanitizedData.username);

  let userId = user._id;
  let universityId = user.universityId.toString();

  let newItem = {
    title: sanitizedData.title,
    description: sanitizedData.description,
    keywords: sanitizedData.keywords,
    price: sanitizedData.price,
    userId: userId,
    universityId: universityId,
    photos: sanitizedData.photos,
    pickUpMethod: sanitizedData.pickUpMethod,
    sold: false,
    bids: [],
    comments: []
  };

  const itemCollection = await items();
  const insertInfo = await itemCollection.insertOne(newItem);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add item!';
  }

  return { itemInserted: true, id: insertInfo.insertedId.toString() };
}

async function updateItem(id, title, description, keywords, price, photos, pickUpMethod, sold) {
  sharedValidation.checkArgumentLength(arguments, 8);

  let sanitizedData = itemValidation.isValidItemUpdateParameters(id, title, description, keywords, price, photos, pickUpMethod, sold);

  const itemCollection = await items();

  let item = await itemCollection.findOne({ _id: ObjectId(sanitizedData.id)});

  if (!item) {
    throw 'Item does not exist!'
  }

  let updateItem = {
    title: sanitizedData.title,
    description: sanitizedData.description,
    keywords: sanitizedData.keywords,
    price: sanitizedData.price,
    photos: sanitizedData.photos,
    pickUpMethod: sanitizedData.pickUpMethod,
    sold: sanitizedData.sold
  };

  const update = await itemCollection.updateOne(
    { _id: ObjectId(sanitizedData.id) },
    { $set: updateItem }
  );

  if (!update.matchedCount && !update.modifiedCount) {
    throw 'Cannot update the item!';
  }

  return { itemUpdated: true };
}

// async function createBids(itemId, bid, userId, accepted) {
//     const itemsCollection = await items();
//     const item = await this.getItem(itemId);
//     const newBid = {
//         bid: bid,
//         userId: userId,
//         accepted: accepted
//     };
//     const updateInfo = await itemsCollection.updateOne({ _id: itemId }, { $push: { bids: newBid } });
//     if (updateInfo.modifiedCount === 0) throw 'Could not add bid';
//
//     return await this.getItem(itemId);
// }
//
// async function createComment(itemId, comment, userId) {
//     const itemsCollection = await items();
//     const item = await this.getItem(itemId);
//     const newComment = {
//         comment: comment,
//         userId: userId
//     };
//     const updateInfo = await itemsCollection.updateOne({ _id: itemId }, { $push: { comments: newComment } });
//     if (updateInfo.modifiedCount === 0) throw 'Could not add comment';
//
//     return await this.getItem(itemId);
// }
//
// async function createRating(itemId, rating, userId) {
//     const itemsCollection = await items();
//     const item = await this.getItem(itemId);
//     const newRating = {
//         userId: userId,
//         rating: rating
//     };
//     const updateInfo = await itemsCollection.updateOne({ _id: itemId }, { $push: { ratings: newRating } });
//     if (updateInfo.modifiedCount === 0) throw 'Could not add rating';
//
//     return await this.getItem(itemId);
// }
//

module.exports = {
    getAllByUniversityId,
    getItemById,
    createItem,
    updateItem
    // createBids,
    // createComment,
    // createRating
};
