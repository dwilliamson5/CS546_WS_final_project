const { ObjectId } = require('mongodb');

function objectifyId(id) {
    return ObjectId(id);
}

function stringifyId(id) {
    return id.toString();
}

function validateObjectId(id) {
    if (!ObjectId.isValid(id)) {
        throw 'invalid object ID';
    }
}

function checkArgumentLength(args, length) {
    let argLength = args.length;

    if (argLength > length) {
        throw `Too many arguments passed to function. Expecting ${length}, got ${argLength}`;
    } else if (argLength < length) {
        throw `Too few arguments passed to function. Expecting ${length}, got ${argLength}`;
    }
}

function checkParamPresent(variable, variableName) {
    if (!variable || variable === undefined) {
        throw `${variableName || 'provided variable'} is not present`;
    }
}

function checkIsString(string, variableName) {
    if (typeof string !== 'string') {
        throw `${variableName || 'provided variable'} is not a string`;
    }
}

function cleanUpString(string) {
    return string.trim();
}

function checkStringLength(string, variableName, minLength) {
    if (string.length === 0) {
        throw `${variableName || 'provided variable'} is empty or only contains spaces`;
    }

    minLength = minLength || 1;
    if (string.length < minLength) {
        throw `${variableName || 'provided variable'} must be more than ${minLength} characters`;
    }
}

function isValidEmail(email) {
  // Check for valid email pattern and only accept .edu addresses
  // Two letter country codes accepted before .edu (e.g. string@string.uk.edu)
  let emailRegex = new RegExp(
    "(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:[A-Z]{2}|edu)\\b"
  );

  return emailRegex.test(email);
}

function isValidUniversityParameters(name, emailDomain) {
  checkParamPresent(name);
  checkParamPresent(emailDomain);
  
  checkIsString(name);
  checkIsString(emailDomain);

  name = cleanUpString(name);
  emailDomain = cleanUpString(emailDomain);
    
  emailDomain = emailDomain.toLowerCase();

  checkStringLength(name);
  checkStringLength(emailDomain);

  if (!isValidEmail(emailDomain)) {
    throw 'Invalid email domain!';
  }

  return {
    name: name,
    emailDomain: emailDomain
  };
}

function isValidUniversityId(id) {
  checkParamPresent(id);
  checkIsString(id);
  id = cleanUpString(id);
  checkStringLength(id);
  validateObjectId(id);

  return id;
}

module.exports = {
  checkArgumentLength,
  isValidUniversityId,
  isValidEmail,
  stringifyId,
  isValidUniversityParameters,
};
