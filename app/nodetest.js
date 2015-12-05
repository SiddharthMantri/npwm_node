var express = require('express');  
var bodyParser = require('body-parser');  
var mongodb = require('mongodb'),  
MongoClient = mongodb.MongoClient;
var assert = require('assert');  
var util=require('util');
var url = 'mongodb://localhost:27017/mydb';
var app = express();  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));
var db;  



MongoClient.connect(url, function(err, database){
	db = database;
	db.collection("tweets",{ }, function(err,result){
		if(err!=null){
			console.dir("Collection not found");
		} else{console.dir("connected to tweets");}
	});


db.collection('tweets').createIndex(
{
 text:"text"
},function(err,indexname){
	console.dir("created index");
	assert.equal(err,null);
});

app.listen(3000);
});


app.get("/",function(req,res){
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/add", function(req,res){
	res.sendFile(__dirname + "/views/add.html");
});




app.post("/tweet/:comment_id", function(req, res) { 
	comment_id = parseInt(req.params.comment_id);
	commentArray=[req.body]
	addComment = db.collection('tweets').update({"id": comment_id}, {$addToSet: {commentArray: req.body}
  }, function(err, result) {
    if (err == null) {
    	db.collection('tweets').find({"id": comment_id}).toArray(function(err, response){
 		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(response));
 	});
    } else {
      res.send(JSON.stringify(response));
    }
  });
});


app.get('/tweet/:comment_id', function(req,res){
	comment_id= parseInt(req.params.comment_id);
 	db.collection('tweets').find({"id": comment_id}).toArray(function(err, response){
 		res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
 	});
});





app.get('/search', function(req,res){
	var query = req.query.q;
	console.log(query)
	var reg = '"'+query+'"';
	//var reg= "\""+query+"\""
	db.collection('tweets').find({
		"$text":{
			"$search":reg
		}
	},
	{
		text:1,
		fromUserName:1,
		id:1, // need all fields from the collection
		
			score:
			{
				$meta: "textScore"
			}
		
	}).toArray(function(err,items){
		console.log(items);
		res.send(pagelist(items));
	})
});


function pagelist(items){ //using each item from the resulting array above to display the field values
	result= "<html><body><ul>";
	items.forEach(function(item){
		itemstring = "<li>" + item.id + "<ul><li>" + item.score + 
		"</li><li>" + item.fromUserName + "</li><li>" + item.text + 
		"<p><b>+++++++++++END OF DOCUMENT++++++++++</ul></b></p>";
		postbox = "<form method=\"post\"><textarea class=\"text\" cols=\"40\" rows =\"5\" name=\"newDocumentField\"></textarea><br/><input type=\"submit\" value=\"Add\" class=\"submitButton\">"
		result = result + itemstring + postbox;
	});
	result = result + "</ul></body></html>";
	return result;
}