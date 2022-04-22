const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const universities = data.universities;

async function testUniversities() {
  let uni1;

  try {
    uni1 = await universities.createUniversity(
      'Stevens Institute of Technology',
      'stevens.edu'
    );
  } catch (e) {
    console.log(e);
  }

  try {
    uni1 = await universities.updateUniversity(
      'Stevens Institute',
      'stevens.edu'
    );
  } catch (e) {
    console.log(e);
  }
}

async function testUsers() {
  try {
    await users.createUser(
      'superadmin',
      'super_admin_password',
      'Super Admin User',
      'super_admin@stevens.edu',
      'imageURL',
      'This is my bio. I am an admin.'
    );
  } catch (e) {
    console.log(e);
  }

  try {
    let user = await users.getUser('superadmin');
    await users.makeSuperAdmin(user.username);
  } catch (e) {
    console.log(e);
  }
}

async function main() {
  console.log('Database Connected');
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  await testUniversities();
  await testUsers();

  console.log('Done seeding database');
  await dbConnection.closeConnection();
}

main();
