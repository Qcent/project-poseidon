const path = require("path");
const express = require("express");
//const routes = require('./controllers');
const sequelize = require("./config/connection");
const path = require('path');

// For uploading photos
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        db(err, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(err, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: 'storage' });

// We need this in the handlebars
// <form action="/profile" method="post" enctype="multipart/form-data">
//   <input type="file" name="image" />
//   <input type='submit' />
// </form>

app.get('/upload', (req, res) => {
    res.render('anyHTML');
});

app.post('/upload', upload.single('image'), (req, res) => {
    res.send('image uploaded');
})

//const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

//const exphbs = require('express-handlebars');
//const hbs = exphbs.create({ helpers });
//app.engine('handlebars', hbs.engine);
//app.set('view engine', 'handlebars');

const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sess = {
  secret: process.env.DB_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// turn on routes
//app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log("Now listening for API requests on port:" + PORT)
  );
});
