const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const universities = mongoCollections.universities;
const bcrypt = require('bcrypt');
const validation = require('./validations/userValidations');

/**
 * Adds a user to the Users collection.
 *
 * @param {String} universityId
 * @param {String} username
 * @param {String} password
 * @param {String} name
 * @param {String} email
 * @param {String} imageURL
 * @param {String} bio
 * @returns An object containing { userInserted: true } if successful.
 * @throws Will throw if parameters are invalid, user already exists,
 *         or there is an issue with the db.
 */
async function createUser(universityId, username, password, name, email, imageURL, bio) {
  // Throws if there is an invalid parameter
  validation.isValidUserParameters(
    username,
    password,
    name,
    email,
    imageURL,
    bio
  );

  // Hash password
  const SALT_ROUNDS = 10;
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  let newUser = {
    universityId: universityId.trim(),
    username: username.trim(),
    name: name.trim(),
    email: email.trim(),
    profileImageUrl: imageURL.trim(),
    bio: bio.trim(),
    password: hash,
    super_admin: false,
    ratings: [],
  };

  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add user!';
  }

  return { userInserted: true };
}

/**
 * Retrieve user from Users collection.
 *
 * @param {String} username
 * @returns The user as an object.
 * @throws Will throw if username parameter is invalid.
 */
async function getUser(username) {
  if (!validation.isValidUsername(username)) {
    throw 'Invalid username passed to getUser!';
  }

  // Check username as case insensitive
  const usernameRegex = new RegExp(["^", username.trim(), "$"].join(""), "i");

  const userCollection = await users();
  const user = await userCollection.findOne({ username: usernameRegex });

  return user;
}

/**
 * Checks if the user's credentials are valid.
 *
 * @param {String} username
 * @param {String} password
 * @returns An object containing { authenticated: true } if successful.
 * @throws Will throw if the parameters are invalid, username doesn't
 *         exist, or the credentials do not match.
 */
async function checkUser(universityId, username, password) {
  if (
    !validation.isValidUsername(username) ||
    !validation.isValidPassword(password)
  ) {
    throw 'Either the username or password is invalid!';
  }

  // Get user
  const user = await getUser(username);
  if (user === null) {
    throw 'Either the username or password is invalid!';
  }

  if (!validation.isValidUniversityWithEmail(universityId, user.email) {
      throw 'Invalid university!'
  }

  let passwordsMatch = false;
  try {
    passwordsMatch = await bcrypt.compare(password, user.password);
  } catch (e) {
    throw 'Exception occurred when comparing passwords!';
  }

  if (!passwordsMatch) {
    throw 'Either the username or password is invalid!';
  }

  return { authenticated: true };
}

async function makeSuperAdmin(username) {
  if (!validation.isValidUsername(username)) {
    throw 'The username is invalid!';
  }

  const user = await getUser(username);
  if (user === null) {
    throw 'The username does not exist!';
  }

  let updateUser = {
    super_admin: true
  };

  const userCollection = await users();
  const update = await userCollection.updateOne(
    { _id: user._id },
    { $set: updateUser }
  );

  if (!update.matchedCount && !update.modifiedCount) {
    throw 'Cannot update the user to super admin!';
  }

  return { userUpdated: true };
}

module.exports = {
  createUser,
  getUser,
  checkUser,
  makeSuperAdmin
};
