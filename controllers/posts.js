const Post = require('../models/post');
const Comment = require('../models/comment');
const Post = require('../models/posts');
const User = require('../models/user');
//const { rejects } = require('node:assert');

module.exports = (app) => {

   // CREATE
app.post("/posts/new", (req, res) => {
  if (req.user) {
    var post = new Post(req.body);post.author=req.user._id;
    
    post
    .save()
    .then(post => {
        return User.findById(req.user._id);
    })
    .then(user => {
        user.posts.unshift(post);
        user.save();
        // REDIRECT TO THE NEW POST
        res.redirect(`/posts/${post._id}`);
    })
    .catch(err => {
        console.log(err.message);
    });
} else {
return res.status(401); // UNAUTHORIZED
}
});


    
    //INDEX
    // INDEX
    app.get('/', (req, res) => {
      var currentUser = req.user;
      // res.render('home', {});
      console.log(req.cookies);
      Post.find({}).lean().populate('author')
      .then(posts => {
          res.render('posts-index', { posts, currentUser });
          // res.render('home', {});
      }).catch(err => {
          console.log(err.message);
      })
  })

      app.get('/posts/new', (req, res) => {
        //   res.send('Hello new posts!')
        res.render('posts-new', {})
        })

            //show
      app.get("/posts/:id", function(req, res) {
        var currentUser = req.user;
        // LOOK UP THE POST
        // Post.findById(req.params.id).lean()
        //   .then(post => {
        //     res.render("posts-show", { post });
        //   })
        //   .catch(err => {
        //     console.log(err.message);
        //   });
        
        // LOOK UP THE POST
        Post.findById(req.params.id).lean().populate({path:'comments', populate: {path: 'author'}}).populate('author')
       .then(post => {
           res.render("posts-show", { post, currentUser });  
       })
       .catch(err => {
           console.log(err.message);
       });
});

      // CREATE Comment
app.post("/posts/:postId/comments", function(req, res) {
    // INSTANTIATE INSTANCE OF MODEL
    const comment = new Comment(req.body);
  
    // SAVE INSTANCE OF Comment MODEL TO DB
    comment
      .save()
      .then(comment => {
        let post = Post.findById(req.params.postId);

        console.log("this is the given comment => ", comment)
        console.log("this is the found post => ", post)
        return post
        //if(!post) reject('no post found')
      })
      .then(post => {

        console.log("***** STEP 2 ******* POST HERE => ", post)
        console.log("***** STEP 2 ******* COMMENT HERE => ", post.comments)

        post.comments.unshift(comment);
        return post.save();
      })
      .then(post => {
        res.redirect(`/`);
      })
      .catch(err => {
        console.log(err);
      });
  });
      
          // SUBREDDIT
// SUBREDDIT
app.get("/n/:subreddit", function (req, res) {
  var currentUser = req.user;
  Post.find({ subreddit: req.params.subreddit }).lean().populate('author')
      .then(posts => {
          res.render("posts-index", { posts, currentUser });
      })
      .catch(err => {
          console.log(err);
      });
});





  };
  