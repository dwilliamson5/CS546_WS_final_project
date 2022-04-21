const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const bcrypt = require('bcrypt');
const validation = require('../validation');

module.exports = {

    /**
     * Adds a user to the Users collection.
     * 
     * @todo Get university object id and verify email against university's
     *       email domain.
     * 
     * @param {String} username 
     * @param {String} password 
     * @param {String} name 
     * @param {String} email 
     * @param {String} imageURL 
     * @param {String} bio 
     * @returns An object containing {userInserted: true} if successful.
     * @throws Will throw if parameters are invalid, user already exists,
     *         or there is an issue with the db.
     */
    async createUser(username, password, name, email, imageURL, bio) 
    {
        // Throws if there is an invalid parameter
        validation.isValidUserParameters(username, password, name, email, imageURL, bio);

        // Check if username already exists
        const user = await this.getUser(username);

        if (user != null)
        {
            throw 'Cannot create username since it already exists!'
        }

        // @todo check if email matches a university's email domain
        // and if so retrieve university id 
        const universityId = "todo";

        // Hash password
        const SALT_ROUNDS = 16;
        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        let newUser = 
        {
            universityId: universityId,
            username: username.trim(),
            name: name.trim(),
            email: email.trim(),
            profileImageUrl: imageURL.trim(),
            bio: bio.trim(),
            password: hash,
            super_admin: false,
            ratings: []
        };

        const userCollection = await users();

        const insertInfo = await userCollection.insertOne(newUser);

        if (!insertInfo.acknowledged || !insertInfo.insertedId)
        {
            throw 'Could not add user!';
        }

        return {userInserted: true};
    },
 
    /**
     * Retrieve user from Users collection.
     * 
     * @param {String} username 
     * @returns The user as an object.
     * @throws Will throw if username parameter is invalid.
     */
    async getUser(username)
    {
        if (!validation.isValidUsername(username))
        {
            throw 'Invalid username passed to getUser!'
        }

        // Check username as case insensitive
        const usernameRegex = new RegExp(["^", username.trim(), "$"].join(""), "i")
    
        const userCollection = await users();

        const user = await userCollection.findOne({ username: usernameRegex });

        return user;
    },

    /**
     * Checks if the user's credentials are valid.
     * 
     * @param {String} username 
     * @param {String} password 
     * @returns An object containing {authenticated: true} if successful.
     * @throws Will throw if the parameters are invalid, username doesn't
     *         exist, or the credentials do not match.
     */
    async checkUser(username, password)
    {
        if (!validation.isValidUsername(username) ||
            !validation.isValidPassword(password))
        {
            throw 'Either the username or password is invalid!'
        }
    
        // Get user
        const user = await this.getUser(username);
        
        if (user === null) 
        {
            throw 'Either the username or password is invalid!';
        }

        let passwordsMatch = false;

        try
        {
            passwordsMatch = await bcrypt.compare(password, user.password);
        }
        catch (e) 
        {
            throw 'Exception occurred when comparing passwords!'
        }

        if (!passwordsMatch)
        {
            throw 'Either the username or password is invalid!';
        }

        return {authenticated: true};
    }
}