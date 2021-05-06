require('dotenv').config();
const express = require('express')
const handlebars = require('handlebars')
// const bodyParser = require('body-parser'); DEPRECATED

const expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');



//added these to connect to heroku
const Comment = require('./models/comment');


const port = process.env.PORT || 3000;




// Set db
require('./data/reddit-db');
//server
//=====================
//=====================
var app = express()
//=====================
//=====================

// Middle ware

const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(cookieParser()); // Add this after you initialize express.

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies
// Add after body parser initialization!
app.use(expressValidator());


// custom middleware--check auth
var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    console.log("in if statement")
    req.user = null;
  } else {
    console.log('in else statement')
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};

// add some auth stuff

app.use(checkAuth);


//controllers
require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);


//testing

// app.get("/", (req, res) => {
//   res.render('main')
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;