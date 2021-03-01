//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

require("dotenv").config();

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let db = {
  user: process.env.USER,
  pass: process.env.PASSWORD,
  dbname: process.env.DBNAME,
  uri:process.env.MONGODB_URI
};

mongoose.connect(db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({}),
    (posts) => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    }
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(() => {
    res.redirect("/");
  });
});

app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;
  return Post.findOne({ _id: requestedPostId },
    (post) => {
      console.log(post);
      res.render("post", {
        id: post.id,
        title: post.title,
        content: post.content,
      });
    })
});

app.get("/editPost/:postId", (req, res) => {
  const requestedPostId = req.params.postId;
  console.log(requestedPostId);
  return Post.findOne({ _id: requestedPostId },
    (post) => { 
      console.log(post);
         res.render("edit", {
           id: post.id,
        title: post.title,
        content: post.content,
      });
    })
});

// app.post("/editPost", (req, res) => {
//   var updatePost= {
//     id: req.body.postId,
//     title: req.body.postTitleUpdate,
//     content: req.body.postBodyUpdate
//   }
//   console.log(updatePost);
//   Post.findByIdAndUpdate({ _id: requestedPostId }, updatePost,{new: true},
//      (err, post) => { 
//         if(err) res.send("error occured")
//       res.send(post)
//     })
//   res.redirect("/")
// });

// app.delete("/:postId/delete", (req, res) =>{
//   const deletePostId = req.params.postId
//   Post.deleteOne({_id: deletePostId}, (err, post) => {
//     if(err){
//       console.log(err);
//     }else{
//       console.log("Post has been removed: ", post);
//       res.redirect("/")
//     }
//   })
// })
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
