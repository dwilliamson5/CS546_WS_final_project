const adminRoutes = require('./admin');
const authRoutes = require('./auth');
const itemsRoutes = require('./items');
const profileRoutes = require('./profile');
const searchRoutes = require('./search');
const data = require('../data/index');
const users = data.users;
const universities = data.universities;
const items = data.items;

const constructorMethod = (app) => {

  app.get('/', async (req, res) => {

    let title = 'Welcome to Unisell';
    let universityName;
    let itemsList;

    if (req.session.user) {
      title += ', ' + req.session.user.username;

      let user = await users.getUser(req.session.user.username);
      let university = await universities.getUniversityById(user.universityId);
      universityName = university.name;
      itemsList = await items.getAllByUniversityId(user.universityId);
    }

    res.render('index', {
      title: title,
      user: req.session.user,
      universityName: universityName,
      itemsList: itemsList
    });
  });

  app.use('/admin', adminRoutes);
  app.use('/auth', authRoutes);
  app.use('/items', itemsRoutes);
  app.use('/profile', profileRoutes);
  app.use('/search', searchRoutes);

  app.use('*', (req, res) => {
    res.status(404).render('errors/404', {
      title: '404',
      message: 'Not found'
    });
  });
};

module.exports = constructorMethod;
