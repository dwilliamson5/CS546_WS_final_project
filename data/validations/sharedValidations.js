function checkArgumentLength(args, length) {
    let argLength = args.length;

    if (argLength > length) {
        throw `Too many arguments passed to function. Expecting ${length}, got ${argLength}`;
    } else if (argLength < length) {
        throw `Too few arguments passed to function. Expecting ${length}, got ${argLength}`;
    }
}

function checkIsString(string, variableName) {
    if (typeof string !== 'string') {
        throw `${variableName || 'provided variable'} is not a string`;
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
