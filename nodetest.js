var express = require('express');  
var bodyParser = require('body-parser');  
var mongodb = require('mongodb'),  
MongoClient = mongodb.MongoClient;
var assert = require('assert');  
var util=require('util');
var url = 'mongodb://npwm_admin:pass123@ds061984.mongolab.com:61984/heroku_4j8g2kcv'
var app = express();  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));
var db;  


MongoClient.connect(url, function(err, database){
	db = database;
	db.collection("restaurant",{ }, function(err,result){
		if(err!=null){
			console.dir("Collection not found");
		} else{console.dir("connected to Restaurants");}
	});
app.listen(3000);

});
app.get("/",function(req,res){
	res.sendFile(__dirname + "/views/index.html");
});
app.get("/add", function(req,res){
	res.sendFile(__dirname + "/views/add.html");
});
app.post("/restaurant/:restaurant_id", function(req, res) { 
	restaurant_id = req.params.restaurant_id;
	commentArray=[req.body.comment]
	addComment = db.collection('restaurant').update({"restaurant_id": restaurant_id}, {"$addToSet": {"review": {'$each': commentArray}}
  }, function(err, result) {
    if (err == null) {
    	db.collection('restaurant').find({"restaurant_id": restaurant_id}).toArray(function(err, response){
 		res.setHeader('Content-Type', 'application/json');
    	res.send({
	    	'response': response,
	    	'success': true
	    });
 	});
    } else {
      res.send({
    	'response': response,
    	'success': true
    });
    }
  });
});


app.get('/restaurant/:restaurant_id', function(req,res){
	restaurant_id= req.params.restaurant_id;
 	db.collection('restaurant').find({"restaurant_id": restaurant_id}).toArray(function(err, response){
 		res.setHeader('Content-Type', 'application/json');
    res.send({
    	'response': response,
    	'success': true
    });
 	});
});





app.get('/search', function(req,res){
	var query = req.query.q;
	var reg = ".*(?i)"+query+".*"
	// var reg = "\""+query+"\"";
	db.collection('restaurant').find({name: {$regex: reg}}).toArray(function(err,items){
		res.setHeader('Content-Type', 'application/json');
		res.send({
			'success': true,
			'response': items
		});
	})
});