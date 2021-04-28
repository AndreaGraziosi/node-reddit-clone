const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = (app) => {

    // CREATE
    app.post('/posts/new', (req, res) => {
      // INSTANTIATE INSTANCE OF POST MODEL
      const post = new Post(req.body);
  
      // SAVE INSTANCE OF POST MODEL TO DB
      post.save((err, post) => {
        // REDIRECT TO THE ROOT
        return res.redirect('/');
      })
    });
    app.get('/', (req, res) => {
        Post.find({}).lean()
          .then(posts => {
            res.render('posts-index', { posts });
          })
          .catch(err => {
            console.log(err.message);
          })
      })
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
        return Post.findById(req.params.postId);
      })
      .then(post => {
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
  