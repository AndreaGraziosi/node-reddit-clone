const express = require('express')
const handlebars = require('handlebars')
// const bodyParser = require('body-parser'); DEPRECATED
const port = 3000
const expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const Comment = require('./models/comment');


require('dotenv').config();


// Set db
require('./data/reddit-db');
//server
var app = express()


// Middle ware
app.use(cookieParser()); // Add this after you initialize express.
const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// add some auth stuff


app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies
// Add after body parser initialization!
app.use(expressValidator());

//controllers
require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);


//testing
module.exports = app;
app.get("/", (req, res) => {
  res.render('main')
})





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})