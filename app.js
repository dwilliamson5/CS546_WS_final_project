const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const session = require('express-session');
const exphbs = require('express-handlebars');
const configRoutes = require('./routes');
const data = require('./data/index');
const users = data.users;

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'AuthCookie',
  secret: 'fb44e8e6-70b8-40b2-8a5e-bd54387831cc',
  resave: false,
  saveUninitialized: true
}));

app.use('*', async (req, res, next) => {
  if (req.session.user) {
    res.locals.user = true;
    
    try {
      let user = await users.getUser(req.session.user.username);

      if (user.super_admin) {
        res.locals.superAdmin = true;
      }
    } catch (e) {
      next();
      return;
    }
  }

  next();
});

app.use('/admin/universities/:id', async (req, res, next) => {
  if (req.method == 'POST') {
    req.method = 'PUT';
  }
  next();
});

app.use('/admin', async (req, res, next) => {
  if (req.session.user) {

    try {
      let user = await users.getUser(req.session.user.username);

      if (user.super_admin) {
        res.locals.inAdmin = true;

        next();
      } else {
        return res.status(403).render('errors/403', { message: 'Admin permission required!' });
      }
    } catch (e) {
      next();
      return;
    }
  } else {
    return res.redirect('/');
  }
});

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
