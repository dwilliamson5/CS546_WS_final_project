const mongoCollections = require('../config/mongoCollections');
const universities = mongoCollections.universities;
const validation = require('./validations/universityValidations');

/**
 * Adds a university to the University collection.
 *
 * @param {String} name
 * @param {String} emailDomain
 * @returns An object containing { universityInserted: true } if successful.
 * @throws Will throw if parameters are invalid, university already exists,
 *         or there is an issue with the db.
 */
async function createUniversity(name, emailDomain) {
  //validation
  validation.isValidUniversityParameters(name.trim(), emailDomain.trim());
  
  // Check if university already exists
  const universityCollection = await universities();
  const university = await universityCollection.findOne({
    emailDomain: emailDomain,
  });

  if (university != null) {
    throw 'Cannot create university since it already exists!';
  }

  let newUniversity = {
    name: name.trim(),
    emailDomain: emailDomain.trim(),
  };

  const insertInfo = await universityCollection.insertOne(newUniversity);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add university!';
  }

  return { universityInserted: true };
}
  
async function updateUniversity(name, emailDomain) {
  validation.isValidUniversityParameters(name.trim(), emailDomain.trim());
  
  const universitiesCollection = await universities();
  const university = await universitiesCollection.findOne({
    emailDomain: emailDomain,
  });

  if (university == null) {
    throw 'University with given emailDomain does not exist!';
  }

  let updateUniversity = {
    name: name.trim(),
    emailDomain: emailDomain.trim(),
  };

  const update = await universitiesCollection.updateOne(
    { _id: university._id },
    { $set: updateUniversity }
  );

  if (!update.matchedCount && !update.modifiedCount) {
    throw 'Cannot update the university!';
  }

  return { universityUpdated: true };
}

async function deleteUniversity(id) {
  const universitiesCollection = await universities();
  const university = await universities.findOne({ _id: id });
  
  if (!university) {
    throw 'No university with given id exists!';
  }

  const deleteUniversity = await universitiesCollection.deleteOne({
    _id: id
  });

  if (deleteUniversity.deletedCount == 0) {
    throw 'Cannot delete university';
  }
  return { universityDeleted: true };
}

module.exports = {
  createUniversity,
  updateUniversity,
  deleteUniversity
};
