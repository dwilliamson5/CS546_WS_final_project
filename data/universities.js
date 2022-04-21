const mongoCollections = require('../config/mongoCollections');
const unis = mongoCollections.universities;

const validation = require('./validations/universityValidations');

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
    async createUniversity(name, emailDomain){
        //validation
        validation.isValidUniversityParameters(name.trim(), emailDomain.trim());
        // Check if university already exists
        const findUniversity = await unis();
        const university = await findUniversity.findOne({ emailDomain: emailDomain});
        if (university != null) throw 'Cannot create university since it already exists!';

        let newUniversity = 
        {
            name: name.trim(),
            emailDomain: emailDomain.trim()
        };
        const universityCollection = await unis();
        const insertInfo = await universityCollection.insertOne(newUniversity);

        if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add university!';
        return {userInserted: true};
    }

}