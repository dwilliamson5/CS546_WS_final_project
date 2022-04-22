const mongoCollections = require("../config/mongoCollections");
const unis = mongoCollections.universities;
const { ObjectId } = require("mongodb");

const validation = require("./validations/universityValidations");

module.exports = {
  /**
   * Adds a university to the University collection.
   *
   * @todo Delete university
   *
   * @param {String} name
   * @param {String} emailDomain
   * @param {String}
   * @param {String}
   * @param {String}
   * @param {String}
   * @returns An object containing {userInserted: true} if successful.
   * @throws Will throw if parameters are invalid, university already exists,
   *         or there is an issue with the db.
   */
  async createUniversity(name, emailDomain) {
    //validation
    validation.isValidUniversityParameters(name.trim(), emailDomain.trim());
    // Check if university already exists
    const findUniversity = await unis();
    const university = await findUniversity.findOne({
      emailDomain: emailDomain,
    });
    if (university != null) {
      throw "Cannot create university since it already exists!";
    }
    let newUniversity = {
      name: name.trim(),
      emailDomain: emailDomain.trim(),
    };
    const universityCollection = await unis();
    const insertInfo = await universityCollection.insertOne(newUniversity);

    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add university!";
    return { universityInserted: true };
  },
  async updateUniversity(name, emailDomain) {
    validation.isValidUniversityParameters(name.trim(), emailDomain.trim());
    const universities = await unis();
    const university = await universities.findOne({
      emailDomain: emailDomain,
    });
    if (university == null) {
      throw "University with given emailDomain does not exist!";
    }
    let updateUniversity = {
      name: name.trim(),
      emailDomain: emailDomain.trim(),
    };
    const id = university["_id"];
    const update = await universities.updateOne(
      { _id: ObjectId(id) },
      { $set: updateUniversity }
    );
    if (!update.matchedCount && !update.modifiedCount) {
      throw "Cannot update the university!";
    }
    return { universityUpdated: true };
  },
  async deleteUniversity(emailDomain) {
    validation.isValidEmail(emailDomain);
    const universities = await unis();
    const findUni = await universities.findOne({ emailDomain: emailDomain });
    if (!findUni) {
      throw "No university with given emailDomain exists!";
    }
    const deleteUni = await universities.deleteOne({
      emailDomain: emailDomain,
    });
    if (deleteUni.deletedCount == 0) {
      throw "Cannot delete university";
    }
    return { universityDeleted: true };
  },
};
