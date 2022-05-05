const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const universities = data.universities;
const items = data.items;

async function testUniversities() {
  try {
    let university = await universities.createUniversity(
      'Stevens Institute of Technology',
      'stevens.edu'
    );
  } catch (e) {
    console.log(e);
  }

  try {
    await universities.createUniversity(
      'Fashion Institute of Technology',
      'fit.edu'
    );
  } catch (e) {
    console.log(e);
  }

  try {
    let universityList = await universities.getAll();
    let university = universityList[0];

    await universities.updateUniversity(
      university['_id'],
      'Stevens Institute',
      'stevens.edu'
    );
  } catch (e) {
    console.log(e);
  }
}

async function testUsers() {
  try {
    let universityList = await universities.getAll();
    let university = universityList[0];

    await users.createUser(
      university['_id'],
      'superadmin',
      'super_admin_password',
      'super_admin_password',
      'Super Admin User',
      'super_admin@stevens.edu',
      'https://cs546-ws-final-project-images.s3.amazonaws.com/1651637929121dog2.jpg',
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

async function testItems() {

  const photos = [{
      _id: '933f9e946b766435325t424354',
      description: 'Front shot of futon',
      imageUrl: 'https://cs546-ws-final-project-images.s3.amazonaws.com/1651668676289arch1.jpg'
    },
    {
      _id: '933f9e946b766435325t424355',
      description: 'Back shot of futon',
      imageUrl: 'https://cs546-ws-final-project-images.s3.amazonaws.com/1651637929121dog2.jpg'
    },
    {
      _id: '933f9e946b766435325t424356',
      description: 'Pillow shot of futon',
      imageUrl: 'https://cs546-ws-final-project-images.s3.amazonaws.com/1651636982290Heart.png'
    },
    {
      _id: '933f9e946b766435325t424357',
      description: 'Bottom shot of futon',
      imageUrl: 'https://cs546-ws-final-project-images.s3.amazonaws.com/1651668785467dog1.jpg'
  }]

  let itemId;

  try {
    let user = await users.getUser('superadmin');

    const result = await items.createItem(
      'Black futon',
      'A black futon that can serve as a couch or bed. Futon is 5 feet by 2 feet. Originally paid 250 for it.',
      'futon, black, couch, bed, furniture',
      '100',
      user.username,
      photos,
      'Need to grab it from Dorm E Room 204. Call me at 215-245-2002'
    );

    itemId = result.id;

  } catch (e) {
    console.log(e);
  }
  
  try {

    for (let i=0; i < photos.length; ++i) {

      let photo = photos[i];

      await items.createPhotoForItem(itemId, photo.description, photo.imageUrl);
    }
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
  await testItems();

  console.log('Done seeding database');
  await dbConnection.closeConnection();
}

main();
