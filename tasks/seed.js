const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const universities = data.universities;

async function testUniversities() {
  //TESTING UNIVERSITIES.JS
  let uni1;
  //CREATE UNI
  try {
    uni1 = await universities.createUniversity(
      "Stevens Institute of Technology",
      "stevens.edu"
    );
  } catch (e) {
    console.log(e);
  }
  //UPDATE UNI
  try {
    uni1 = await universities.updateUniversity(
      "Stevens Institute",
      "stevens.edu"
    );
  } catch (e) {
    console.log(e);
  }
  //DELETE UNI
  try {
    uni1 = await universities.deleteUniversity("stevens.edu");
  } catch (e) {
    console.log(e);
  }
}
async function testUsers() {
  //TESTING USERS.JS
  let user1, user2, user3;
  //CREATE USER
  try {
    user1 = await users.createUser(
      "GaYoungP",
      "thismypassword",
      "GaYoung Park",
      "gpark@stevens.edu",
      "imageURL",
      "This is my bio"
    );
  } catch (e) {
    console.log(e);
  }
  //GET USER
  //CHECKUSER

  //ERRORS
}
async function main() {
  console.log("Database Connected");
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  await testUniversities();
  await testUsers();

  console.log("Done seeding database");
  await dbConnection.closeConnection();
}

main();
