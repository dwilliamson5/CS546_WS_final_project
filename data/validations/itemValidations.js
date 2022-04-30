const sharedValidation = require('./sharedValidations');

function isValidItemParameters(title, description, keywords, price, username, photos, pickUpMethod) {
  sharedValidation.checkParamPresent(title, 'title');
  sharedValidation.checkParamPresent(description, 'description');
  sharedValidation.checkParamPresent(keywords, 'keywords');
  sharedValidation.checkParamPresent(price, 'price');
  sharedValidation.checkParamPresent(username, 'username');
  sharedValidation.checkParamPresent(photos, 'photos');
  sharedValidation.checkParamPresent(pickUpMethod, 'pickUpMethod');

  sharedValidation.checkIsString(title, 'title');
  sharedValidation.checkIsString(description, 'description');
  sharedValidation.checkIsString(keywords, 'keywords');
  sharedValidation.checkIsString(price, 'price');
  sharedValidation.checkIsString(username, 'username');
  sharedValidation.checkIsString(photos, 'photos');
  sharedValidation.checkIsString(pickUpMethod, 'pickUpMethod');

  title = sharedValidation.cleanUpString(title);
  description = sharedValidation.cleanUpString(description);
  keywords = sharedValidation.cleanUpString(keywords);
  price = sharedValidation.cleanUpString(price);
  username = sharedValidation.cleanUpString(username);
  photos = sharedValidation.cleanUpString(photos);
  pickUpMethod = sharedValidation.cleanUpString(pickUpMethod);

  sharedValidation.checkStringLength(title, 'title');
  sharedValidation.checkStringLength(description, 'description');
  sharedValidation.checkStringLength(keywords, 'keywords');
  sharedValidation.checkStringLength(price, 'price');
  sharedValidation.checkStringLength(username, 'username');
  sharedValidation.checkStringLength(photos, 'photos');
  sharedValidation.checkStringLength(pickUpMethod, 'pickUpMethod');

  keywords = keywords.split(',');

  keywords.forEach((keyword, index) => {
    sharedValidation.checkIsString(keyword, 'keyword');
    keyword = sharedValidation.cleanUpString(keyword);
    sharedValidation.checkStringLength(keyword, 'keyword');
    keywords[index] = keyword;
  });

  photos = photos.split(',');

  photos.forEach((photo, index) => {
    sharedValidation.checkIsString(photo, 'photo');
    photo = sharedValidation.cleanUpString(photo);
    sharedValidation.checkStringLength(photo, 'photo');
    photos[index] = photo;
  });

  if (price < 0) {
    throw 'price cannot be below 0 (free)';
  }

  return {
    title: title,
    description: description,
    keywords: keywords,
    price: price,
    username: username,
    photos: photos,
    pickUpMethod: pickUpMethod
  };
}

function isValidItemUpdateParameters(id, title, description, keywords, price, photos, pickUpMethod, sold) {
  id = sharedValidation.isValidItemId(id);

  sharedValidation.checkParamPresent(title, 'title');
  sharedValidation.checkParamPresent(description, 'description');
  sharedValidation.checkParamPresent(keywords, 'keywords');
  sharedValidation.checkParamPresent(price, 'price');
  sharedValidation.checkParamPresent(username, 'username');
  sharedValidation.checkParamPresent(photos, 'photos');
  sharedValidation.checkParamPresent(pickUpMethod, 'pickUpMethod');

  sharedValidation.checkIsString(title, 'title');
  sharedValidation.checkIsString(description, 'description');
  sharedValidation.checkIsString(keywords, 'keywords');
  sharedValidation.checkIsString(price, 'price');
  sharedValidation.checkIsString(username, 'username');
  sharedValidation.checkIsString(photos, 'photos');
  sharedValidation.checkIsString(pickUpMethod, 'pickUpMethod');

  title = sharedValidation.cleanUpString(title);
  description = sharedValidation.cleanUpString(description);
  keywords = sharedValidation.cleanUpString(keywords);
  price = sharedValidation.cleanUpString(price);
  username = sharedValidation.cleanUpString(username);
  photos = sharedValidation.cleanUpString(photos);
  pickUpMethod = sharedValidation.cleanUpString(pickUpMethod);

  sharedValidation.checkStringLength(title, 'title');
  sharedValidation.checkStringLength(description, 'description');
  sharedValidation.checkStringLength(keywords, 'keywords');
  sharedValidation.checkStringLength(price, 'price');
  sharedValidation.checkStringLength(username, 'username');
  sharedValidation.checkStringLength(photos, 'photos');
  sharedValidation.checkStringLength(pickUpMethod, 'pickUpMethod');

  keywords = keywords.split(',');

  keywords.forEach((keyword, index) => {
    sharedValidation.checkIsString(keyword, 'keyword');
    keyword = sharedValidation.cleanUpString(keyword);
    sharedValidation.checkStringLength(keyword, 'keyword');
    keywords[index] = keyword;
  });

  photos = photos.split(',');

  photos.forEach((photo, index) => {
    sharedValidation.checkIsString(photo, 'photo');
    photo = sharedValidation.cleanUpString(photo);
    sharedValidation.checkStringLength(photo, 'photo');
    photos[index] = photo;
  });

  if (price < 0) {
    throw 'price cannot be below 0 (free)';
  }

  if (sold == 'true') {
    sold = true
  } else if (sold == 'false') {
    sold = false;
  } else {
    throw 'Sold is not a proper value';
  }

  return {
    id: id,
    title: title,
    description: description,
    keywords: keywords,
    price: price,
    username: username,
    photos: photos,
    pickUpMethod: pickUpMethod,
    sold: sold
  };
}

module.exports = {
  isValidItemParameters,
  isValidItemUpdateParameters
};
