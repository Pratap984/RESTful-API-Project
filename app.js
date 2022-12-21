const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', true);

const articleSchema = {
  title: String,
  content: String
};

const Artical = mongoose.model("Artical",articleSchema);
///////////////////////////////////////////////////Requests for All articles///////////////////////////////
app.route("/articles")
//Get all articles
.get(function(req,res){
  Artical.find(function(err,foundarticles){
    if(!err)
    {
      res.send(foundarticles);
    }
    else{
      res.send(err);
    }

  });
})
//Post Request
.post(function(req,res){
  const newArticle = new Artical({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(!err)
    {
      res.send("Successfully added new article");
    }
    else{
      res.send(err);
    }
  });
})

//Delete All articles
.delete(function(req,res){
  Artical.deleteMany(function(err){
    if(!err)
    {
      res.send("Successfully deleted all articles");
    }
    else{
      res.send(err);
    }
  });
});

///////////////////////////////////////////////////Requests for specifed articles//////////////////////////////////
app.route("/articles/:articleTitle")

.get(function(req,res)
{
  Artical.findOne({title:req.params.articleTitle},function(err,result){
    if(result)
    {
      res.send(result);
    }
    else{
      res.send("No article Found");
    }
  })
})

.put(function(req,res){
  Artical.replaceOne(
    {title:req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err, article) {
      if(!err){
        res.send("Successfully updated changes");
      }
      else{
        res.send("article not found");
      }

    })
})

.patch(function(req,res){
  Artical.updateOne(
    {title:req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err, article) {
      if(!err){
        res.send("Successfully updated changes");
      }
      else{
        res.send("article not found");
      }

    })
})

.delete(function(req,res)
{
  Artical.deleteOne(
    {title:req.params.articleTitle},
    function(err)
    {
      if(!err)
      {res.send("Successfully deleted specified article");}
    }
  )
});



app.listen(3000, function(){
  console.log("Server started at port 3000");
})
