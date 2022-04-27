const { ObjectId } = require('mongodb');

function isValidString(string) {
  if (
    string === undefined ||
    typeof string !== 'string' ||
    string.trim().length === 0) {
    return false;
  }

  return true;
}

function isValidEmail(email) {
  if (!isValidString(email)) {
    return false;
  }

  // Check for valid email pattern and only accept .edu addresses
  // Two letter country codes accepted before .edu (e.g. string@string.uk.edu)
  let emailRegex = new RegExp(
    "(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:[A-Z]{2}|edu)\\b"
  );

  return emailRegex.test(email);
}
 
function isValidUniversityId(id){
    if (!ObjectId.isValid(id)) {
      throw 'Invalid university ID';
  }
}

function isValidUniversityParameters(name, emailDomain) {
  if (!isValidString(name)) throw 'Invalid university name!';
  if (!isValidEmail(emailDomain)) throw 'Invalid email domain!';

  return true;
}

module.exports = {
  isValidString,
  isValidEmail,
  isValidUniversityId,
  isValidUniversityParameters,
};
