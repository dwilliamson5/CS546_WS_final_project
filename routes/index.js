const adminRoutes = require('./admin');
const authRoutes = require('./auth');
const data = require('../data/index');
const users = data.users;

const constructorMethod = (app) => {

  app.get('/', async (req, res) => {

    let title = 'Welcome to Unisell';
    let super_admin = false;

    if (req.session.user) {
      title += ', ' + req.session.user.username;

      let user = await users.getUser(req.session.user.username);
      super_admin = user.super_admin;
    }

    res.render('index', { title: title, user: req.session.user, super_admin: super_admin });
  });

  app.use('/admin', adminRoutes);
  app.use('/auth', authRoutes);

  app.use('*', (req, res) => {
    res.status(404).render('errors/404', { message: 'Not found' });
  });
};

module.exports = constructorMethod;
