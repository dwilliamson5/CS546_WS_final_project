const sharedValidation = require('./sharedValidations');

function isAlphaNumeric(string) {
    // ASCII codes
    const ZERO = 48;
    const NINE = 57;
    const A_UPPER = 65;
    const Z_UPPER = 90;
    const A_LOWER = 97;
    const Z_LOWER = 122;

    let asciiCode;

    for (let i = 0; i < string.length; i++) {
        asciiCode = string.charCodeAt(i);

        if (!(asciiCode >= ZERO && asciiCode <= NINE) &&
            !(asciiCode >= A_UPPER && asciiCode <= Z_UPPER) &&
            !(asciiCode >= A_LOWER && asciiCode <= Z_LOWER)) {
            return false;
        }
    }

    return true;
}

function containsNoSpaces(string) {
    // ASCII codes
    const SPACE = 32;

    let asciiCode;

    for (let i = 0; i < string.length; i++) {
        asciiCode = string.charCodeAt(i);

        if (asciiCode == SPACE) {
            return false;
        }
    }

    return true;
}

function isValidUsername(username) {
    const MIN_USERNAME_LENGTH = 4;

    if (username.length < MIN_USERNAME_LENGTH) {
        throw 'Username is less than 4 characters';
    }

    if (!isAlphaNumeric(username)) {
        throw 'Username can only be alphanumeric characters';
    }
}

function isValidPassword(password, variableName) {
    const MIN_PASSWORD_LENGTH = 6;

    if (password.length < MIN_PASSWORD_LENGTH) {
        throw `${variableName || 'password'} is less than 4 characters`;
    }

    if (!containsNoSpaces(password)) {
        throw `${variableName || 'password'} cannot contain any spaces`;
    }
}

function passwordsMatch(password, password_confirmation) {
    if (password != password_confirmation) {
        throw 'Password and password_confirmation must match';
    }
}

function isValidEmail(email) {
    // Check for valid email pattern and only accept .edu addresses
    // Two letter country codes accepted before .edu (e.g. string@string.uk.edu)
    let emailRegex = new RegExp('[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:[A-Z]{2}|edu)\\b');

    if (!emailRegex.test(email)) {
        throw 'Email is not a valid university email address!';
    }
}

function getEmailDomain(email) {
    return email.split('@')[1];
}

function validateDomainsMatch(domain1, domain2) {
    if (domain1 != domain2) {
        throw 'Email domain does not match selected university domain!';
    }
}

function isValidUserParameters(universityId, username, password, password_confirmation, name, email, imageURL, bio) {
    sharedValidation.checkParamPresent(universityId);
    sharedValidation.checkParamPresent(username);
    sharedValidation.checkParamPresent(password);
    sharedValidation.checkParamPresent(password_confirmation);
    sharedValidation.checkParamPresent(name);
    sharedValidation.checkParamPresent(email);
    sharedValidation.checkParamPresent(imageURL);
    sharedValidation.checkParamPresent(bio);

    sharedValidation.checkIsString(universityId);
    sharedValidation.checkIsString(username);
    sharedValidation.checkIsString(password);
    sharedValidation.checkIsString(password_confirmation);
    sharedValidation.checkIsString(name);
    sharedValidation.checkIsString(email);
    sharedValidation.checkIsString(imageURL);
    sharedValidation.checkIsString(bio);

    universityId = sharedValidation.cleanUpString(universityId);
    username = sharedValidation.cleanUpString(username);
    password = sharedValidation.cleanUpString(password);
    password_confirmation = sharedValidation.cleanUpString(password_confirmation);
    name = sharedValidation.cleanUpString(name);
    email = sharedValidation.cleanUpString(email);
    imageURL = sharedValidation.cleanUpString(imageURL);
    bio = sharedValidation.cleanUpString(bio);

    username = username.toLowerCase();
    email = email.toLowerCase();
    
    sharedValidation.isValidUniversityId(universityId)

    isValidUsername(username);
    isValidPassword(password, 'password');
    isValidPassword(password_confirmation, 'password_confirmation');
    passwordsMatch(password, password_confirmation)
    isValidEmail(email)

    return {
        universityId: universityId,
        username: username,
        password: password,
        password_confirmation: password_confirmation,
        name: name,
        email: email,
        imageURL: imageURL,
        bio: bio
    }
}

function validateUsername(username) {
    sharedValidation.checkParamPresent(username);
    sharedValidation.checkIsString(username);
    username = sharedValidation.cleanUpString(username);
    username = username.toLowerCase();
    isValidUsername(username);

    return username;
}

function isValidCheckUserParameters(universityId, username, password) {
    sharedValidation.checkParamPresent(universityId);
    sharedValidation.checkParamPresent(username);
    sharedValidation.checkParamPresent(password);

    sharedValidation.checkIsString(universityId);
    sharedValidation.checkIsString(username);
    sharedValidation.checkIsString(password);

    universityId = sharedValidation.cleanUpString(universityId);
    username = sharedValidation.cleanUpString(username);
    password = sharedValidation.cleanUpString(password);

    username = username.toLowerCase();

    sharedValidation.isValidUniversityId(universityId)
    isValidUsername(username);
    isValidPassword(password, 'password');

    return {
        universityId: universityId,
        username: username,
        password: password
    }
}

// async function isValidUserUpdateParameters(existingUsername, username, name, email, imageURL, bio) {

//      if (!isValidUsername(username)) {
//          throw 'Invalid username!';
//      }

//      if (!isValidUsername(existingUsername)) {
//          throw 'Invalid existing username!';
//      }

//      if (!isValidString(name)) {
//          throw 'Invalid name!';
//      }

//      if (!isValidEmail(email)) {
//          throw 'Invalid email!';
//      }

//      if (!isValidString(imageURL)) {
//          throw 'Invalid image URL!';
//      }

//      if (!isValidString(bio)) {
//          throw 'Invalid bio!';
//      }

//      return true;
// }

// async function shouldUpdatePassword(passwordl, passwordr) {

//     // If the passwords are empty, then just return
//     if (passwordl === '' && passwordr === '') {
//         return false;
//     }

//     // Check they are valid
//     if (!isValidPassword(passwordl) || !isValidPassword(passwordr)) {
//         throw 'New password is invalid!';
//     }

//     // Check they match
//     if (passwordl !== passwordr) {
//         throw 'New passwords don\'t match';
//     }

//     return true;
// }

module.exports = {
    isValidUserParameters,
    validateUsername,
    getEmailDomain,
    validateDomainsMatch,
    isValidCheckUserParameters
    // isValidUserUpdateParameters,
    // shouldUpdatePassword
};
