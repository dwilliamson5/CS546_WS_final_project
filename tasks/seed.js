const { TopologyDescription } = require('mongodb');
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const universities = data.universities;
const items = data.items;

async function testUniversities() {
  try {
    await universities.createUniversity(
      'Stevens Institute of Technology',
      'stevens.edu'
    );
  } catch (e) {
    console.log(e);
  }
  try {
    await universities.createUniversity(
      'Rutgers University',
      'rutgers.edu'
    );
  } catch (e) {
    console.log(e);
  }
}

async function testUsers() {
  try {
    var universityList = await universities.getAll();
    var university = universityList[0];
    var university2 = universityList[1];
    await users.createUser(
      university['_id'],
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
    await users.createUser(
      university2['_id'],
      'GaYoung',
      'myPassword',
      'User',
      'gpark2@rutgers.edu',
      'imageURL',
      'This is my bio.'
    );
  } catch (e) {
    console.log(e);
  }
  try {
    await users.checkUser(
      university['_id'],
      'superadmin',
      'super_admin_password'
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
async function testItems(){
  try{
    var universityList = await universities.getAll();
    var university = universityList[0];
    var user = await users.getUser('GaYoung');
    futon = await items.createItem("futon", "Used futon for sale", ["futon"], 10, false, user._id, university._id, "my house", [], [], []);
  }
  catch(e){
    console.log(e);
  }
  try{
    await items.createBids(futon['_id'], 14, user['_id'], false);
  }
  catch(e){
    console.log(e);
  }
  try{
    await items.createComment(futon._id, "Could you post more pictures?", user._id);
  }
  catch(e){
    console.log(e);
  }
  try{
    await items.createRating(futon._id, 3, user._id);
  }
  catch(e){
    console.log(e);
  }
}

async function main() {
  console.log('Database Connected');
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  await testUniversities();
  await testUsers();
  await testItems();

  console.log('Done seeding database');
  await dbConnection.closeConnection();
}

main();
