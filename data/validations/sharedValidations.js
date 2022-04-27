function checkArgumentLength(argLength, length) {
    if (argLength > length) {
        throw `Too many arguments passed to function. Expecting ${length}, got ${argLength}`;
    } else if (argLength < length) {
        throw `Too few arguments passed to function. Expecting ${length}, got ${argLength}`;
    }
}

function checkIsString(variable) {
    if (typeof variable !== 'string') {
        throw `${variable || 'provided variable'} is not a string`;
    }
}

function lower(attr) {
    return attr.toLowerCase();
}

module.exports = {
    checkArgumentLength,
    checkIsString,
    lower
};
