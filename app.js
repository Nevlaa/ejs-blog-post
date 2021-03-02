//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("./models/posts");

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
  uri: process.env.MONGODB_URI,
};

mongoose
  .connect(db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });

app.get("/", async (req, res) => {
  Post.find({}).then((posts) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save();
  res.redirect("/");
});

app.get("/posts/:postId", async (req, res) => {
  const requestedPostId = req.params.postId;
  Post.findOne({ _id: requestedPostId }).then((post) => {
    console.log(post);
    res.render("post", {
      id: post.id,
      title: post.title,
      content: post.content,
    });
  });
});

app.post("/posts/:postId", (req, res) => {
  const deletePost = Post.findOneAndDelete({ _id: req.params.postId });
  deletePost.exec(() => res.redirect("/"));
});

app.get("/update/:postId", async (req, res) => {
  const requestedPostId = req.params.postId;
  console.log(requestedPostId);
  Post.findOne({ _id: requestedPostId }).then((post) => {
    res.render("update", {
      id: post.id,
      title: post.title,
      content: post.content,
    });
  });
});

app.post("/update/:postId", async (req, res) => {
  const id = req.params.postId;
  const updatePost = new Post({
    _id: id,
    title: req.body.postTitleUpdate,
    content: req.body.postBodyUpdate,
  });
  const query = Post.updateOne(
    { _id: id },
    { $set: updatePost },
    { new: true }
  );
  query.exec(() => {
    res.redirect("/");
  });
  // query.getFilter()._id instanceof mongoose.Types.ObjectId;
});

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
