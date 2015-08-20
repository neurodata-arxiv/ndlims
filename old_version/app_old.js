var express = require('express');
var app = express();
var mongoClient = require('mongodb').MongoClient;
var port = 8080;
var http = require('http');
var host = "127.0.0.1";
var mongoPort = "27017";
var dbName = "lims";
var connectionString = "mongodb://" + host + ":" + mongoPort + "/" + dbName;

function parseQueryParams(urlQueryParams, callback) { // callback
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


app.get('/kki42', function(req, res) {
	//Sub Number,SubjectID,Group,Fiducial,Age,Sex,Subject Code,_id
	// if want to do age range, can either do ?ageRange=12,15
	var query;
	
	parseQueryParams(req.query, function(err, params) {
		query = params;
		console.log(params);
	
	});
	
	
	/* var ageRange = req.query.ageRange;
	var subj_age = req.query.age;
	var subject_age = parseInt(subj_age);
	var gender = req.query.sex;
	var query = {};	

	if(!req.query) {
		console.log("query parameters are: " + JSON.stringify(req.query));
	}
	if(ageRange) {
		var ages = ageRange.split(",");
		var age1 = parseInt(ages[0]);
		var age2 = parseInt(ages[1]);
		
		if(age1 > age2) {
			query.Age = "{$lte : " + age1 + "}";
		}
		else if(age1 == age2) {
		
		}
		else {
		
		}
	}
	
	if(subject_age) {
		query.Age = subject_age;
	}
	if(gender) {
		query.Sex = gender;
	}
	if(query) {
		console.log(JSON.stringify(query));
	}
 */
	console.log("yay, this is the subject information API!");

	mongoClient.connect(connectionString, function(err,db) {

		if(err) {
			callback(err,null);
		}
		var collName = "kki42";	

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

app.get('/collection/:coll_name', function(req, res) {
	//Sub Number,SubjectID,Group,Fiducial,Age,Sex,Subject Code,_id
	// if want to do age range, can either do ?ageRange=12,15
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


// check to see if a field exists in a collection, if so, return it
app.get('/collection/:coll_name/exists/:field_name', function(req, res) {
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

// get subject info by subject number
app.get('/collection/:coll_name/subnum/:subj_num', function(req, res) {
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


http.createServer(app).listen(port);
console.log("HTTP server listening on port: " + port);
