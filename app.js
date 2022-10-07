//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash")


const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

//connect to db with mongoose
mongoose.connect(Process.env.URL, { useNewUrlParser: true });


const articleSchema = new mongoose.Schema ({
  title: String,
  content: String,
});

//create new mongoose model using article schema
const Article = mongoose.model("Article", articleSchema);

//chaining route handlers: requests targetting all articles 
app
  .route("/articles")
  //get all articles
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  //create a new article and sending data to the server without a front-end
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save();
    res.send("New article saved");
  })
  //delete articles
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("delete successful");
      } else {
        res.send(err);
      }
    });
  });

//chaning routes: requests targeting specific articles 
app.route("/articles/:title")
    .get(function(req, res){
          const articleTitle = req.params.title;
          Article.findOne({title : articleTitle}, function(err, foundArticle) {
            if(!err){
                res.send(foundArticle);
            } else{
                res.send(err);
            }
          })
    })
    .put(function (req, res) {
        let article = req.params.title;

        let newTitle = req.body.title;
        let newContent = req.body.content
        Article.replaceOne({title: article}, 
            {title: newTitle, content: newContent},
            function(err){
            if(!err){
                res.send("update successful");
            } else {
                res.send(err);
            }
        }
      );
    });


//get route
app.get("/", function (req, res) {
  res.send("welcome to the simple article API");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
