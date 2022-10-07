//jshint esversion:6
require("dotenv").config()
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

const link = process.env.URL;
//connect to db with mongoose
mongoose.connect(link, { useNewUrlParser: true });


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


app.route("/articles/:articleTitle")

.get(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.findOne({title: articleTitle}, function(err, article){
    if (article){
      const jsonArticle = JSON.stringify(article);
      res.send(jsonArticle);
    } else {
      res.send("No article with that title found.");
    }
  });
})

.patch(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.update(
    {title: articleTitle},
    {content: req.body.newContent},
    function(err){
      if (!err){
        res.send("Successfully updated selected article.");
      } else {
        res.send(err);
      }
    });
})

.put(function(req, res){

  const articleTitle = req.params.articleTitle;

  Article.findOneAndUpdate(
    {title: articleTitle},
    { $push: { title : req.body.title, content: req.body.newContent}},
    // {overwrite: true},
    function(err){
      if (!err){
        res.send("Successfully updated the content of the selected article.");
      } else {
        res.send(err);
      }
    });
})


.delete(function(req, res){
  const articleTitle = req.params.articleTitle;
  LostPet.findOneAndDelete({title: articleTitle}, function(err){
    if (!err){
      res.send("Successfully deleted selected article.");
    } else {
      res.send(err);
    }
  });
});


//get home route
app.get("/", function (req, res) {
  res.send("welcome to the simple article API");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
