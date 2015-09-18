var express = require('express');
var app = express();
var mongoClient = require('mongodb').MongoClient;
var port = 9876;
var http = require('http');
var host = "127.0.0.1";
var mongoPort = "27017";
var dbName = "lims";
var connectionString = "mongodb://" + host + ":" + mongoPort + "/" + dbName;
var bodyParser = require('body-parser');
var multer = require('multer'); 

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

function parseQueryParams(urlQueryParams, callback) { // parses query parameters
	var mongoQuery = {};
	
	console.log(JSON.stringify(urlQueryParams));
	
	if(urlQueryParams.age) {
		urlQueryParams.age = parseInt(urlQueryParams['age']);
	}
	
	if(urlQueryParams.ageRange) {
		var ages = urlQueryParams.ageRange.split(",");
		var age1 = parseInt(ages[0]);
		var age2 = parseInt(ages[1]);
		
		if(age2 > age1) {
			urlQueryParams['age'] = {};
			urlQueryParams['age']['$lte'] = age2;
			urlQueryParams['age']['$gte'] = age1;
			
			console.log(urlQueryParams);
			
			delete urlQueryParams.ageRange;
		}
		else if(age1 == age2) {
			urlQueryParams.age = age1;
			delete urlQueryParams.ageRange;
		}
		else {
			urlQueryParams['age'] = {};
			urlQueryParams['age']['$lte'] = age1;
			urlQueryParams['age']['$gte'] = age2;
			
			console.log(urlQueryParams);
			
			delete urlQueryParams.ageRange;
		}
	}
	
	if(urlQueryParams.subj_num) {
		urlQueryParams.subj_num = parseInt(urlQueryParams['subj_num']);
	}
	if(urlQueryParams._id) {
		urlQueryParams._id = parseInt(urlQueryParams['_id']);
	}
	if(urlQueryParams.subj_id) {
		urlQueryParams.subj_id = parseInt(urlQueryParams['subj_id']);
	}
	if(urlQueryParams.group) {
		urlQueryParams.group = parseInt(urlQueryParams['group']);
	}
	console.log(JSON.stringify(urlQueryParams));
	
	mongoQuery = urlQueryParams;
	
	callback(null, mongoQuery);
}

app.get('/collection/:coll_name/delete/:id/', function(req, res) {
	// this api takes an id of a record of a particular collection and deletes it
	var collName = req.params.coll_name;
	var idVal = parseInt(req.params.id);
	var rowQuery = {};
	rowQuery['_id'] = idVal;
	
	console.log(rowQuery);
	
	mongoClient.connect(connectionString, function(err,db) {
		db.collection(collName).remove(rowQuery, function(err) {
			if (err) {
				res.sendStatus(404);
				res.end();			
			}
			else {
				res.sendStatus(200);
				res.end();
			}
			db.close();
		});
	});
	
});

app.get('/collection/:coll_name/unset/:id/:field_name', function(req, res) {
	// this api takes a record with a particular id (:id) from a collection (:coll_name) and removes a particular field (:field_name)
	var collName = req.params.coll_name;
	var idVal = parseInt(req.params.id);
	var fieldToSet = req.params.field_name;
	var rowQuery = {};
	rowQuery['_id'] = idVal;
	var updateQuery = {};
	updateQuery[fieldToSet] = "";
	
	console.log(collName);
	console.log(rowQuery);
	console.log(updateQuery);
	
	mongoClient.connect(connectionString, function(err,db) {
		db.collection(collName).update(rowQuery,{$unset:updateQuery}, function(err) {
			if (err) {
				res.sendStatus(404);
				res.end();			
			}
			else {
				res.sendStatus(200);
				res.end();
			}
			db.close();
		});
	});
	
});

app.get('/collection/:coll_name/set/:id/:field_name', function(req, res) {
	// this api takes a record with a particular id (:id) from a collection (:coll_name) and removes a particular field (:field_name)
	var collName = req.params.coll_name;
	var idVal = parseInt(req.params.id);
	var fieldToSet = req.params.field_name;
	var valueToSet = req.query.value;
	var rowQuery = {};
	rowQuery['_id'] = idVal;
	var updateQuery = {};
	updateQuery[fieldToSet] = valueToSet;
	
	console.log(collName);
	console.log(rowQuery);
	console.log(updateQuery);
	
	mongoClient.connect(connectionString, function(err,db) {
		db.collection(collName).update(rowQuery,{$set:updateQuery}, function(err) {
			if (err) {
				res.sendStatus(404);
				res.end();			
			}
			else {
				res.sendStatus(200);
				res.end();
			}
			db.close();
		});
	});
	
});

app.get('/collection/:coll_name', function(req, res) {
	// this api returns all records contained in a particular collection
	var collName = req.params.coll_name;
	var query;
	
	parseQueryParams(req.query, function(err, params) {
		query = params;
		console.log(params);
	
	});
	
	mongoClient.connect(connectionString, function(err,db) {

		if(err) {
			callback(err,null);
		}
		//var collName = "kki42";	

		db.collection(collName).find(query).toArray(function(err, results) {
			if(err) {
				res.send("Sorry, this result cannot be found!");
				res.end();
			}
			else {
				res.setHeader('Content-Type', 'application/json');
				res.send(results);
				res.end();
				db.close();
			}
		}); // end of collection connection
	}); // end of db connection

});

app.get('/collection/:coll_name/exists/:field_name', function(req, res) {
	// check to see if a field exists in a particular collection, if so, return it
	var collName = req.params.coll_name;
	var fieldName = req.params.field_name;
	var query = {};
	query[fieldName] = {};
	query[fieldName]['$exists'] = true;
	
	console.log(query);

	mongoClient.connect(connectionString, function(err,db) {

		if(err) {
			callback(err,null);
		}
		//var collName = "kki42";	

		db.collection(collName).find(query).toArray(function(err, results) {
			if(err) {
				res.send("Sorry, this result cannot be found!");
				res.end();
			}
			else {
				res.setHeader('Content-Type', 'application/json');
				console.log(results);
				res.send(results);
				res.end();
				db.close();
			}
		}); // end of collection connection
	}); // end of db connection

});

app.get('/collection/:coll_name/subnum/:subj_num', function(req, res) {
	// this api gets all metadata from a particular collection belonging to a particular subject number
	console.log("yay, this is the specific subject information API!");
	var collName = req.params.coll_name;
	var sub_num = req.params.subj_num;
	var subject_num = parseInt(sub_num);
	
	if(req.query) {
		console.log("query parameters are: " + JSON.stringify(req.query));
	}

	mongoClient.connect(connectionString, function(err,db) {

		if(err) {
			callback(err,null);
		}	

		db.collection(collName).find({"Sub Number" : subject_num}).toArray(function(err, results) {
			if(err) {
				res.send("Sorry, this result cannot be found!");
				res.end();
			}
			else {
				res.setHeader('Content-Type', 'application/json');
				res.send(results);
				res.end();
				db.close();
			}
		}); // end of collection connection
	}); // end of db connection

});

app.post('/lims/:project_name', function(req, res) {
	// this api accepts JSON and inserts it into the db with corresponding project name
	var json = req.body;
	var projName = req.params.project_name;

	json.project_name = projName;

	console.log("woo, this is the post API! Your project name is: " + projName);
	console.log(req.body.Author);
	mongoClient.connect(connectionString, function(err,db) {

		if(err) {
			callback(err,null);
		}

		db.collection('channels').insert(json, function(err, results) {
			if(err) {
				res.send("Sorry, your data is in the wrong format!");
				res.end();
			}
			else {
				res.setHeader('Content-Type', 'application/json');
				res.send(results);
				res.end();
				db.close();
			}
		}); // end of collection connection
	}); // end of db connection

});

app.post('/lims/:token/:channel', function(req, res) {
	// this api accepts JSON and inserts it into the db
	var json = req.body;
	var token = req.params.token;
	var channel = req.params.channel;
	var collName = "test";
	console.log("woo, this is the post API!");

	console.log(json);
	
	mongoClient.connect(connectionString, function(err,db) {

		if(err) {
			callback(err,null);
		}

		db.collection(collName).insert(json, function(err, results) {
			if(err) {
				res.send("Sorry, your stuff isn't in the right format!");
				res.end();
			}
			else {
				res.setHeader('Content-Type', 'application/json');
				res.send(results);
				res.end();
				db.close();
			}
		}); // end of collection connection
	}); // end of db connection

});

app.get('/lims/:token/:channel_name', function(req, res) {
	// this api gets all metadata corresponding to a particular token and channel name
	var token = req.params.token;
	var chanName = req.params.channel_name;
	console.log("woo, this is the post API!");
	
	var query = {};
	query.name = chanName;
	query.tokens = token;
	
	mongoClient.connect(connectionString, function(err,db) {

		if(err) {
			callback(err,null);
		}

		db.collection('channels').find(query).toArray(function(err, results) {
			if(err) {
				res.send("Sorry, you done messed up!");
				res.end();
			}
			else {
				res.setHeader('Content-Type', 'application/json');
				res.send(results);
				res.end();
			}
		}); // end of collection connection
	}); // end of db connection

});


http.createServer(app).listen(port);
console.log("HTTP server listening on port: " + port);
