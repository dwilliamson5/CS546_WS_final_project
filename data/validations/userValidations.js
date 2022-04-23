function isValidString(string) {
    if (string === undefined ||
        typeof string !== 'string' ||
        string.trim().length === 0) {
        return false;
    }

    return true;
}

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
    if (!isValidString(username)) {
        return false;
    }

    const MIN_USERNAME_LENGTH = 4;

    if (username.length < MIN_USERNAME_LENGTH) {
        return false;
    }

    // Check only alphanumeric characters
    if (!isAlphaNumeric(username)) {
        return false;
    }

    return true;
}

function isValidPassword(password) {
    if (!isValidString(password)) {
        return false;
    }

    const MIN_PASSWORD_LENGTH = 6;

    if (password.length < MIN_PASSWORD_LENGTH) {
        return false;
    }

    if (!containsNoSpaces(password)) {
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
    let emailRegex = new RegExp('[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:[A-Z]{2}|edu)\\b');

    return emailRegex.test(email);
}

function isValidUserParameters(username, password, name, email, imageURL, bio) {
    if (!isValidUsername(username)) {
        throw 'Invalid username!';
    }

    if (!isValidPassword(password)) {
        throw 'Invalid password!';
    }

    if (!isValidString(name)) {
        throw 'Invalid name!';
    }

    if (!isValidEmail(email)) {
        throw 'Invalid email!';
    }

    if (!isValidString(imageURL)) {
        throw 'Invalid image URL!';
    }

    if (!isValidString(bio)) {
        throw 'Invalid bio!';
    }

    return true;
}

module.exports = {
    isValidString,
    isAlphaNumeric,
    containsNoSpaces,
    isValidUsername,
    isValidPassword,
    isValidEmail,
    isValidUserParameters
};
