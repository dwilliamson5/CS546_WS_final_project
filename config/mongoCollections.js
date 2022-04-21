const dbConnection = require('./mongoConnections');

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

module.exports = {
  universities: getCollectionFn('universities'),
  items: getCollectionFn('items'),
  users: getCollectionFn('users')
};