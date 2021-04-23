const express = require('express')
const handlebars = require('handlebars')
const bodyParser = require('body-parser');
const port = 3000
const expressValidator = require('express-validator');
// Set db
require('./data/reddit-db');
//server
const app = express()
// Middleware
const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies
// Add after body parser initialization!
app.use(expressValidator());

//controllers
require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);


//testing
module.exports = app;

app.get('/posts/new', (req, res) => {
//   res.send('Hello Booches!')
res.render('posts-new', {})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})