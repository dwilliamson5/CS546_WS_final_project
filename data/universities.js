const mongoCollections = require('../config/mongoCollections');
const universities = mongoCollections.universities;
const universityValidation = require('./validations/universityValidations');
const { ObjectId } = require('mongodb');

async function getAll() {
    universityValidation.checkArgumentLength(arguments, 0);

    const universityCollection = await universities();
    let universitiesList = await universityCollection.find({}).toArray();

    if (!universitiesList) {
        throw 'Could not get all universities';
    }

    universitiesList.forEach(university => {
      university._id = universityValidation.stringifyId(university._id);
    });

    return universitiesList;
}

async function getUniversityById(id) {
  universityValidation.checkArgumentLength(arguments, 1);
  id = universityValidation.isValidUniversityId(id);

  const universityCollection = await universities();
  const university = await universityCollection.findOne({ _id: ObjectId(id) });

  if (!university) {
    throw 'University does not exist!'
  }

  return university;
}

async function createUniversity(name, emailDomain) {
  universityValidation.checkArgumentLength(arguments, 2);

  let sanitizedData = universityValidation.isValidUniversityParameters(name, emailDomain);

  verifyUniversityIsUnique(sanitizedData.name, sanitizedData.emailDomain);

  let newUniversity = {
    name: sanitizedData.name,
    emailDomain: sanitizedData.emailDomain
  };

  const insertInfo = await universityCollection.insertOne(newUniversity);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add university!';
  }

  return { universityInserted: true };
}

async function updateUniversity(id, name, emailDomain) {
  universityValidation.checkArgumentLength(arguments, 3);

  let sanitizedData = universityValidation.isValidUniversityParameters(name, emailDomain);

  verifyUniversityIsUnique(sanitizedData.name, sanitizedData.emailDomain);

  let updateUniversity = {
    name: sanitizedData.name,
    emailDomain: sanitizedData.emailDomain
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

async function verifyUniversityIsUnique(name, emailDomain) {
  universityValidation.checkArgumentLength(arguments, 2);

  let sanitizedData = universityValidation.isValidUniversityParameters(name, emailDomain);

  // add ID and dont throw if ID matches the result

  const universityCollection = await universities();
  
  let university = await universityCollection.findOne({
    name: sanitizedData.name
  });

  if (university != null) {
    throw 'Cannot create university since name is taken!';
  }

  university = await universityCollection.findOne({
    emailDomain: sanitizedData.emailDomain
  });

  if (university != null) {
    throw 'Cannot create university since emailDomain is taken!';
  }
}

// async function deleteUniversity(id) {
//   const universitiesCollection = await universities();
//   const university = await universities.findOne({ _id: id });

//   if (!university) {
//     throw 'No university with given id exists!';
//   }

//   const deleteUniversity = await universitiesCollection.deleteOne({
//     _id: id
//   });

//   if (deleteUniversity.deletedCount == 0) {
//     throw 'Cannot delete university';
//   }
//   return { universityDeleted: true };
// }

module.exports = {
  getAll,
  getUniversityById,
  createUniversity,
  updateUniversity,
  // deleteUniversity
};
