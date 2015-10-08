Router.route('/', {where: 'server'})
.get(function() {
    this.response.statusCode = 200;
    this.response.end( (new Date()).toString() + "\n" );
});


Router.route('/api/metadata/get/:id', {where: 'server'})
.get(function () {
    var req = this.request.body;
	var res = this.response;
	var idToGet = this.params.id;
	var rowQuery = {};
	rowQuery['_id'] = idToGet;
	
    var data = Metadata.find(rowQuery).fetch();

    if (data) {
        res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.end(JSON.stringify(data));
    } else {
		res.statusCode = 400;
		res.setHeader("Content-Type","text/plain");
        this.response.end("Sorry, that particular document could not found!");
    }
});

Router.route('/api/metadata/delete/:id/', {where: 'server'})
.get(function () {
	// this api takes an id of a record of a particular collection and deletes it
	var req = this.request.body;
	var res = this.response;
	var idToDelete = this.params.id;
	var rowQuery = {};
	rowQuery['_id'] = idToDelete;
	
	num = Metadata.remove(rowQuery);
	
	if (parseInt(num) == 0) {
		res.statusCode = 400;
		res.setHeader("Content-Type","text/plain");
		res.end("Sorry, there was an error deleting your document!");			
	}
	else {
		res.statusCode = 200;
		res.setHeader("Content-Type","text/plain");
		res.end("Success!");
	}
});

Router.route('/api/metadata/unset/:id/:field_name', {where: 'server'})
.get(function () {
	// this api takes a record with a particular id (:id) from a collection and removes a particular field (:field_name)
	var req = this.request.body;
	var res = this.response;
	var collName = this.params.coll_name;
	var idVal = this.params.id;
	var fieldToSet = this.params.field_name;
	var rowQuery = {};
	rowQuery['_id'] = idVal;
	var updateQuery = {};
	updateQuery[fieldToSet] = "";
	
	num = Metadata.update(rowQuery,{$unset:updateQuery});
	
	console.log(num);
	console.log(typeof(num));
	
	if (parseInt(num) == 0) {
		res.statusCode = 400;
		res.setHeader("Content-Type","text/plain");
		res.end("Sorry, there was an error with your unset command!");			
	}
	else {
		res.statusCode = 200;
		res.setHeader("Content-Type","text/plain");
		res.end("Success!");
	}
});

Router.route('/api/metadata/set/:id/:field_name', {where: 'server'})
.get(function () {
	// this api takes a record with a particular id (:id) from a collection and adds a particular field (:field_name) with a value parameter
	var req = this.request.body;
	var res = this.response;
	var collName = this.params.coll_name;
	var idVal = this.params.id;
	var fieldToSet = this.params.field_name;
	var valueToSet = this.params.query.value;
	var rowQuery = {};
	rowQuery['_id'] = idVal;
	var updateQuery = {};
	updateQuery[fieldToSet] = valueToSet;
	
	num = Metadata.update(rowQuery,{$set:updateQuery});
	
	console.log(num);
	console.log(typeof(num));
	
	if (parseInt(num) == 0) {
		res.statusCode = 400;
		res.setHeader("Content-Type","text/plain");
		res.end("Sorry, there was an error with your set command!");			
	}
	else {
		res.statusCode = 200;
		res.setHeader("Content-Type","text/plain");
		res.end("Success!");
	}	
});

Router.route('/api/metadata/exists/:field_name', {where: 'server'})
.get(function () {
	// check to see if a field exists in a particular collection, if so, return it
	var req = this.request.body;
	var res = this.response;
	var fieldName = this.params.field_name;
	var query = {};
	query[fieldName] = {};
	query[fieldName]['$exists'] = true;
	
	var data = Metadata.find(query).fetch();
	
	if(!data) {
		res.statusCode = 400;
		res.setHeader("Content-Type","text/plain");
		res.end("Sorry, bad query!");
	}
	else if(!data[0]) {
		res.statusCode = 200;
		res.setHeader("Content-Type","text/plain");
		res.end("Sorry, no field by that name exists!");
	}
	else {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(data));
	}

});

Router.route('/api/metadata/get', {where: 'server'})
.get(function () {
    var req = this.request.body;
	var res = this.response;
	var query;
	
	parseQueryParams(this.params.query, function(err, params) {
		query = params;
		console.log(params);
	
	});
	
    var data = Metadata.find(query).fetch();

    if (data) {
        res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.end(JSON.stringify(data));
    } else {
		res.statusCode = 400;
		res.setHeader("Content-Type","text/plain");
        this.response.end("Metadata not found!");
    }
});

Router.route('/api/metadata/set', { where: 'server' })
.post(function () {
	var res = this.response;
    var newMD = this.request.body.metadata;
	var newId = '';
	var resObj = {};
	
	if(newMD) {
		newId = Metadata.insert(newMD);
		resObj['_id'] = newId;
		res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.end(JSON.stringify(resObj));
	}
	else {
		resObj['_id'] = newId;
		res.statusCode = 400;
		res.setHeader("Content-Type","text/plain");
		res.end("Improper JSON - expected metadata field!");
	}
	
    res.end();
});


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
