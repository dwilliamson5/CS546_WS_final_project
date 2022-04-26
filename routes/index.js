const adminRoutes = require('./admin');
const authRoutes = require('./auth');
const itemsRoutes = require('./items');
const data = require('../data/index');
const users = data.users;
const universities = data.universities;

const constructorMethod = (app) => {

  app.get('/', async (req, res) => {

    let title = 'Welcome to Unisell';
    let super_admin = false;
    let universityName;

    if (req.session.user) {
      title += ', ' + req.session.user.username;

      let user = await users.getUser(req.session.user.username);
      let university = await universities.getUniversityById(user.universityId);
      universityName = university.name;
      super_admin = user.super_admin;
    }

    res.render('index', {
      title: title,
      user: req.session.user,
      super_admin: super_admin,
      universityName: universityName
    });
  });

  app.use('/admin', adminRoutes);
  app.use('/auth', authRoutes);
  app.use('/items', itemsRoutes);

  app.use('*', (req, res) => {
    res.status(404).render('errors/404', { message: 'Not found' });
  });
};

module.exports = constructorMethod;
