

Router.route('/metadata/ocp/get/:token', {where: 'server'})
.get(function () {
    var req = this.request.body;
	var res = this.response;

    var data = OCPMetadata.findOne({token: this.params.token});

    if (data) {
        res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.end(JSON.stringify(data));
    } else {
        var error = RoutingError("Could not find metadata record with token " + this.params.token, 400);
		res.statusCode = 400;
		res.setHeader("Content-Type","application/json");
        res.end(JSON.stringify(error));
    }
});


Router.route('/metadata/ocp/set/:token', {where: 'server'})
.post(function () {
    var req = this.request.body;
	var res = this.response;

    var data = OCPMetadata.findOne({token: this.params.token});

    if (data) {
        var error = RoutingError("Metadata for token " + this.params.token + " already exists.", 500);
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(error));
    } else {
        var insert = this.request.body;
        insert.token = this.params.token;
        insert._created = new Date();
        var id = OCPMetadata.insert(insert);
        if (id) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({_id: id}));
        } else {
            var error = RoutingError("Metadata for token " + this.params.token + " could not be inserted.", 500);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(error));
        }
    }
});
