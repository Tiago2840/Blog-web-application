// Express server
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static("public"));

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Application logic
var postsList = [];
var id = 1;

app.get("/", (req, res) => {
  console.log(postsList);
  res.render("index.ejs", { title: "Blog Home", posts: postsList.reverse() });
});
app.get("/about", (req, res) => {
  console.log(postsList);
  res.render("about.ejs", {
    title: "About the Application",
    posts: postsList.reverse(),
  });
});

app.post("/submit", (req, res) => {
  let d = new Date(),
    dformat =
      [d.getMonth() + 1, d.getDate(), d.getFullYear()].join("/") +
      " " +
      [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");

  let newPost = {
    id: id++,
    creationDateTime: dformat,
    postHeader: req.body.postHeader,
    postContent: req.body.postContent,
  };
  postsList.push(newPost);
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  let postId = parseInt(req.body.id);
  let postIndex = postsList.findIndex((post) => post.id === postId);

  if (postIndex !== -1) {
    postsList[postIndex].postHeader = req.body.postHeader;
    postsList[postIndex].postContent = req.body.postContent;
  }

  res.redirect("/");
});

app.post("/delete", (req, res) => {
  let postId = parseInt(req.body.id);
  postsList = postsList.filter((post) => post.id !== postId);

  res.redirect("/");
});

app.get("/post/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = postsList.find((post) => post.id === postId);
  if (post) {
    res.json(post);
  } else {
    res.status(404).send("Post not found");
  }
});
