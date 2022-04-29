const sharedValidation = require('./sharedValidations');

function isValidUniversityParameters(name, emailDomain) {
  sharedValidation.checkParamPresent(name);
  sharedValidation.checkParamPresent(emailDomain);

  sharedValidation.checkIsString(name);
  sharedValidation.checkIsString(emailDomain);

  name = sharedValidation.cleanUpString(name);
  emailDomain = sharedValidation.cleanUpString(emailDomain);

  emailDomain = emailDomain.toLowerCase();

  sharedValidation.checkStringLength(name);
  sharedValidation.checkStringLength(emailDomain);

  if (!sharedValidation.isValidEmail(emailDomain)) {
    throw 'Invalid email domain!';
  }

  return {
    name: name,
    emailDomain: emailDomain
  };
}

module.exports = {
  isValidUniversityParameters
};
