const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users; //TO DO

async function main() {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();
  //TESTING HERE


  console.log('Done seeding database');
  await dbConnection.closeConnection();
}

main();