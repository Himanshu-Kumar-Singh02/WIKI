const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const wikiSchema = new mongoose.Schema({
  title: "String",
  content: "String"
});

const article = mongoose.model("article", wikiSchema);

app.route("/articles")

  .get(function(req, res) {
    article.find(function(err, foundelement) {
      if (err) {
        console.log(err);
      } else {
        res.send(foundelement);
      }
    });
  })

  .post(function(req, res) {

    const article1 = new article({
      title: req.body.title,
      content: req.body.content
    });
    article1.save();
  })

  .delete(function(req, res) {
    article.deleteMany(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.send("deleted succesfully");
      }
    });
  });








app.route("/articles/:articletitle")
  .get(function(req, res) {
    article.findOne({
      title: req.params.articletitle
    }, function(err, foundarticle) {
      if (foundarticle) {
        res.send(foundarticle);
      } else {
        res.send("not found");
      }
    });
  })
  .put(function(req, res) {
    article.update({
        title: req.params.articletitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("succesfully updated");
        }
      }
    )
  })

  .patch(function(req, res) {
    article.update({
        title: req.params.articletitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("successfully updated thing only")
        }
      }
    )
  })

  .delete(function(req, res) {
    article.deleteOne({
      title: req.params.articletitle
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.send("deleted one item");
      }
    });

  });


app.listen(3000, function() {
  console.log("server running");
});
