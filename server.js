const yelp = require("yelp-fusion");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({});
const passport = require("passport");
const local = require("./utils/local");

const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;


const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

app.enable("trust proxy");
const sess = {
  secret: process.env.DB_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
  cookie: {
    maxAge: 300000,
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

// passport initializing
app.use(passport.initialize());
app.use(passport.session());




sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {console.log(`App listening on port ${PORT}!`);
  });
})
