var express = require('express');  
var bodyParser = require('body-parser');  
var mongodb = require('mongodb'),  
MongoClient = mongodb.MongoClient;
var assert = require('assert');  
var util=require('util');
var url = 'mongodb://bhavin:pass123@ds059694.mongolab.com:59694/npm_db';
//var url = 'mongodb://npwm_admin:pass123@ds061984.mongolab.com:61984/heroku_4j8g2kcv'
var app = express();  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));
var db;  


MongoClient.connect(url, function(err, database){
	db = database;
	db.collection("Restaurants",{ }, function(err,result){
		if(err!=null){
			console.dir("Collection not found");
		} else{console.dir("connected to Restaurants");}
	});


	/*	db.collection('Restaurants').createIndex(
		{
		 name:"text"
		},function(err,indexname){
			console.dir("created index");
			assert.equal(err,null);
		});*/

app.listen(3000);

/*http.createServer(app).listen(app.get('port'));*/
});


app.get("/",function(req,res){
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/add", function(req,res){
	res.sendFile(__dirname + "/views/add.html");
});




app.post("/restaurant/:restaurant_id", function(req, res) { 
	restaurant_id = parseInt(req.params.restaurant_id);
	commentArray=[req.body]
	addComment = db.collection('Restaurants').update({"id": restaurant_id}, {$addToSet: {commentArray: req.body}
  }, function(err, result) {
    if (err == null) {
    	db.collection('Restaurants').find({"id": restaurant_id}).toArray(function(err, response){
 		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(response));
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
	console.log(restaurant_id);
 	db.collection('Restaurants').find({"restaurant_id": restaurant_id}).toArray(function(err, response){
 		res.setHeader('Content-Type', 'application/json');
    res.send({
    	'response': response,
    	'success': true
    });
 	});
});





app.get('/search', function(req,res){
	var query = req.query.q;
	console.dir(query)
	var reg = "\""+query+"\"";
	console.dir(reg)
	db.collection('Restaurants').find({
		"$text":{
			"$search":reg
		}
	},
	{
		name:1,
		borough:1,
		restaurant_id:1, // need all fields from the collection
		
			score:
			{
				$meta: "textScore"
			}
		
	}).toArray(function(err,items){
		res.setHeader('Content-Type', 'application/json');
		res.send({
			'success': true,
			'response': items
		});
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