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
    item.imageURL = item.photos && item.photos[0].imageUrl;

    let photos = item.photos;

    photos.forEach(photo => {
      photo._id = sharedValidation.stringifyId(photo._id);
    })
  });

  return itemList;
}

async function getAllByUniversityIdAndKeyword(id, keyword) {
  sharedValidation.checkArgumentLength(arguments, 2);
  id = sharedValidation.isValidUniversityId(id);
  sharedValidation.checkIsString(keyword);
  keyword = sharedValidation.cleanUpString(keyword);
  sharedValidation.checkStringLength(keyword, 'keyword');

  const itemCollection = await items();
  let itemList = await itemCollection.find({ sold: false, keywords: keyword, universityId: id }).toArray();

  if (!itemList) {
    throw 'No items for that keyword';
  }

  itemList.forEach(item => {
    item._id = sharedValidation.stringifyId(item._id);
    item.imageURL = item.photos && item.photos[0].imageUrl;

    item.photos.forEach(photo => {
      photo._id = sharedValidation.stringifyId(photo._id);
    })
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
    photos: [],
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

  let item = await itemCollection.findOne({ _id: ObjectId(sanitizedData.id) });

  if (!item) {
    throw 'Item does not exist!'
  }

  let updateItem = {
    title: sanitizedData.title,
    description: sanitizedData.description,
    keywords: sanitizedData.keywords,
    price: sanitizedData.price,
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

async function createComment(id, username, comment) {
  sharedValidation.checkArgumentLength(arguments, 3);

  let sanitizedData = itemValidation.isValidComment(id, username, comment);

  let user = await users.getUser(sanitizedData.username);

  const itemCollection = await items();

  let item = await itemCollection.findOne({ _id: ObjectId(sanitizedData.id) });

  if (!item) {
    throw 'Item does not exist!'
  }

  const newComment = {
    _id: ObjectId(),
    commentersUserId: user._id,
    text: sanitizedData.comment
  };

  const itemsCollection = await items();
  const updatedInfo = await itemsCollection.updateOne({ _id: ObjectId(item._id) }, { $addToSet: { comments: newComment } });

  if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
    throw 'Could not create comment successfully';
  }

  const output = {
    photo: user.profileImageUrl || '/public/images/blank.jpg',
    text: newComment.text,
    username: user.username
  }

  return output;
}

async function getCommentsForItemId(id) {
  sharedValidation.checkArgumentLength(arguments, 1);

  id = sharedValidation.isValidItemId(id);

  let item = await getItemById(id);

  let comments = item.comments;

  let output = []

  for (let i = 0; i < comments.length; i++) {
    comment = comments[i];

    let user = await users.getUserById(comment.commentersUserId.toString());

    let result = {
      photo: user.profileImageUrl || '/public/images/blank.jpg',
      username: user.username,
      text: comment.text
    };

    output.push(result);
  }

  return output;
}

async function getImagesForItemId(id) {
  sharedValidation.checkArgumentLength(arguments, 1);

  id = sharedValidation.isValidItemId(id);

  let item = await getItemById(id);

  if (!item) {
    throw 'Item does not exist!'
  }

  let photos = item.photos;

  let output = []

  for (let i = 0; i < photos.length; i++) {
    let photo = photos[i];

    let result = {
      _id: photo._id,
      description: photo.description,
      imageURL: photo.imageUrl || '/public/images/blank.jpg'
    };

    output.push(result);
  }

  return output;
}

async function getPhoto(itemId, imageId) {
  sharedValidation.checkArgumentLength(arguments, 2);

  itemId = sharedValidation.isValidItemId(itemId);
  imageId = sharedValidation.isValidItemId(imageId);

  let item = await getItemById(itemId);

  if (!item) {
    throw 'Item does not exist!'
  }

  const itemCollection = await items();

  let photo = await itemCollection.aggregate(
    [
      {
        $match:
        {
          "photos._id": ObjectId(imageId)
        }
      },
      {
        $addFields:
        {
          photos:
          {
            $filter:
            {
              input: "$photos",
              cond:
              {
                $eq: ["$$this._id", ObjectId(imageId)]
              }
            }
          }
        }
      },
      { $unwind: "$photos" },
      {
        $project:
        {
          _id: "$photos._id",
          title: "$photos.description",
          releaseDate: "$photos.imageUrl"
        }
      }
    ]).toArray();

  if (!photo || photo.length === 0) {
    throw 'Photo does not exist!'
  }

  photo[0]._id = photo[0]._id.toString();

  return photo[0];
}

async function createPhotoForItem(id, description, imageURL) {
  sharedValidation.checkArgumentLength(arguments, 3);

  let sanitizedData = itemValidation.isValidPhoto(id, description, imageURL);

  const itemCollection = await items();

  let item = await itemCollection.findOne({ _id: ObjectId(sanitizedData.id) });

  if (!item) {
    throw 'Item does not exist!'
  }

  let newPhoto = {
    _id: ObjectId(),
    description: sanitizedData.description,
    imageUrl: sanitizedData.imageURL
  };

  const itemsCollection = await items();
  const updatedInfo = await itemsCollection.updateOne({ _id: ObjectId(item._id) }, { $addToSet: { photos: newPhoto } });

  if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
    throw 'Could not create photo successfully';
  }

  return { photoAdded: true };
}

async function editPhotoForItem(itemId, imageId, description, imageURL) {
  sharedValidation.checkArgumentLength(arguments, 4);

  let sanitizedData = itemValidation.isValidPhoto(itemId, description, imageURL);
  imageId = sharedValidation.isValidItemId(imageId);

  const itemCollection = await items();

  let item = await itemCollection.findOne({ _id: ObjectId(sanitizedData.id) });

  if (!item) {
    throw 'Item does not exist!'
  }

  let photo = await getPhoto(sanitizedData.id, imageId);

  const updatedInfo = await itemCollection.updateOne(
    { 
      "_id": ObjectId(sanitizedData.id),
      "photos._id": ObjectId(photo._id)
    },
    { 
      $set: { 
        "photos.$.description": sanitizedData.description,
        "photos.$.imageUrl": sanitizedData.imageURL
      } 
    }
  );

  if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
    throw 'Could not update photo successfully';
  }

  return { photoUpdated: true };
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
  getAllByUniversityIdAndKeyword,
  getItemById,
  createItem,
  updateItem,
  createComment,
  getCommentsForItemId,
  getImagesForItemId,
  getPhoto,
  createPhotoForItem,
  editPhotoForItem
  // createBids,
  // createRating
};
