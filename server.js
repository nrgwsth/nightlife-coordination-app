var express = require('express');

var app = express();

var mongoose = require("mongoose");

var passport = require("passport");

var bodyParser = require("body-parser");

var yelp = require("node-yelp");

var configurePassport = require("./passport/configurePassport");

var exphbs = require("express-handlebars");

var User = require("./models/User.model.js");

var Bar = require("./models/Bar.model.js");


mongoose.connect(process.env.MONGO_URI, function(err){
  if(err){
    console.log("connection failed" ,err);
  } else{
    console.log("mongoose connection successful");
  }
});


app.engine("handlebars", exphbs({defaultLayout: "main"}));

app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var client = yelp.createClient({
  oauth:{
    "consumer_key": process.env.yelpConsumerKey,
    "consumer_secret":process.env.yelpConsumerSecret,
    "token":process.env.yelpToken,
    "token_secret":process.env.tokenSecret
  }
})

app.use(express.static('public'));


app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());

app.use(passport.session());

configurePassport(passport);

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/api/search/:loc", function (req, res) {
  var tempids=[];
  Bar.find(
    {}).exec((err,bars)=>{
    if(err) throw err;
    bars.forEach((bar)=>{
      tempids.push(bar.id);
    });
    
    client.search({
      location: req.params.loc
    }).then(function(data){
      console.log(tempids);
      var restaurents = data.businesses;
      for(var i=0, ii =restaurents.length; i<ii; i++){
        restaurents[i].going = 0;
        var index = tempids.indexOf(restaurents[i].id);
        if(index>=0){
          restaurents[i].going = bars[index].going.length;
        }
      }
      
      res.status(200).send(restaurents);
    }).catch(function(err){
      if(err.type == "UNAVAILABLE_FOR_LOCATION"){
        res.send(null);
      }
    });
    
  });
  
});


app.get("/logout", function(req,res){
  req.logout();
  res.redirect("/");
})
app.get("/auth/twitter", passport.authenticate("twitter"));


app.get('/auth/twitter/callback', passport.authenticate("twitter", {failureRedirect: "/"}), function(req, res){
  res.redirect("/");
});
		
		
app.post("/api/going", function(req,res){
  console.log("hey",req.body);
  Bar.findOne({
    id: req.body.res
  }).exec((err, bar)=>{
    console.log("bar",bar);
    if(err) throw err;
    if(!bar){
      var newBar = new Bar();
      newBar.id = req.body.res;
      newBar.going = [req.body.id];
      newBar.save();
      res.send({
        going: true
      });
    } else{
      if(bar.going.indexOf(req.body.id)>=0){
        bar.going.splice(bar.going.indexOf(req.body.id), 1);
        bar.save((err)=>{
          if(err) throw err;
          res.send({
            going: false
          });
        });
      } else{
        bar.going.push(req.body.id);
        bar.save((err)=>{
          if(err) throw err;
            res.send({
            going: true
          });
      });
      }
      
      
    }
  });
});

app.get("/api/isuserloggedin", function(req,res){
  if(req.user){
    res.json({
      "success": true,
      "user": req.user
    });
  } else{
    res.json({
      "success": false
    })
  }
});

app.get("/api/getalldata", function(req, res){
  Bar.find({}).exec((err, bars)=>{
    if(err) throw err;
    res.send(bars);
  })
})


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
