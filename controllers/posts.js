const Post = require('../models/post');
const Comment = require('../models/comment');
//sconst { rejects } = require('node:assert');

module.exports = (app) => {

   // CREATE
app.post("/posts/new", (req, res) => {
  if (req.user) {
    var post = new Post(req.body);

    post.save(function(err, post) {
      return res.redirect(`/`);
    });
  } else {
    return res.status(401); // UNAUTHORIZED
  }
});

    
    //INDEX
    app.get("/", (req, res) => {
      var currentUser = req.user;
    
      Post.find({})
        .then(posts => {
          res.render("posts-index", { posts, currentUser });
        })
        .catch(err => {
          console.log(err.message);
        });
    });

      app.get('/posts/new', (req, res) => {
        //   res.send('Hello new posts!')
        res.render('posts-new', {})
        })

            //show
      app.get("/posts/:id", function(req, res) {
        // LOOK UP THE POST
        // Post.findById(req.params.id).lean()
        //   .then(post => {
        //     res.render("posts-show", { post });
        //   })
        //   .catch(err => {
        //     console.log(err.message);
        //   });
        
        // LOOK UP THE POST
Post.findById(req.params.id).lean().populate('comments').then((post) => {
    res.render('posts-show', { post })
  }).catch((err) => {
    console.log(err.message)
  })
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
app.get("/n/:subreddit", function(req, res) {
    Post.find({ subreddit: req.params.subreddit }).lean()
      .then(posts => {
        res.render("posts-index", { posts });
      })
      .catch(err => {
        console.log(err);
      });
  
  });






  };
  