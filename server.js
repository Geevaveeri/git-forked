const yelp = require("yelp-fusion");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({});
const passport = require("passport");
const local = require("./utils/local");

const routes = require('./controllers');

const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sess = {
  secret: process.env.DB_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
  cookie: {
    maxAge: 30000,
  },
};
app.use(session(sess));



// Middleware
app.engine("handlebars", exphbs({ defaultLayout: 'main' }));
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(require("./controllers/"));

app.use(function(req,res, next){
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

// passport initializing
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);



sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {console.log(`App listening on port ${PORT}!`);
  });
})









