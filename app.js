//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//connect to db with mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });


//chaining route handlers
app.route("/articles").get(function (req, res){
    Article.find(function(err, foundArticles){
        if(!err){
        res.send(foundArticles);
        } else {
            res.send(err);
        }

    })
}).post(function(req, res){
    const newArticle = new Article ({
        title: req.body.title,  
        content: req.body.content
    })
    
            newArticle.save();
        res.send("New article saved");
    
}).delete()


const articleSchema = {
    title: String,
    content: String
};


//create new mongoose model using article schema
const Article = mongoose.model("Article", articleSchema);


//get route
app.get("/", function (req, res) {
    res.send("welcome to the simple article API");
})

//get all articles
app.get("/articles", function (req, res) {
    Article.find(function (err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    })
})

//create a new article and sending data to the server without a front-end
app.post("/articles", function (req, res) {
    
    //newArticle document sourced from API Post request using postman
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })

    //save article
    newArticle.save(function (err) {
        if (!err) {
            res.send("New article saved");
        } else {
            res.send(err);
        }
    });
})


//delete articles 
app.delete("/articles", function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("delete successful")
        } else {
            res.send(err);
        }
    })

})


app.listen(3000, function () {
    console.log("Server started on port 3000");
});