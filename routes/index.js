const adminRoutes = require('./admin');
const authRoutes = require('./auth');

const constructorMethod = (app) => {

  app.get('/', async (req, res) => {

    let title = 'Welcome to Unisell';

    if (req.session.user) 
    {
      title += ', ' + req.session.user.username;
    }

    res.render('index', { title: title });
  });

  app.use('/admin', adminRoutes);
  app.use('/auth', authRoutes);

  app.use('*', (req, res) => {
    res.status(404).render('errors/404', { message: 'Not found' });
  });
};

module.exports = constructorMethod;