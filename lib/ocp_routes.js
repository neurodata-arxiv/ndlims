

Router.route('/metadata/ocp/get/:token', {where: 'server'})
.get(function () {
    var req = this.request.body;
	var res = this.response;

    var data = OCPMetadata.findOne({token: this.params.token});

    if (data) {
        data.secret = undefined;
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


Router.route('/metadata/ocp/set', {where: 'server'})
.post(function () {
    var req = this.request.body;
	var res = this.response;

    var data = OCPMetadata.findOne({token: req.token});

    if (data) {
        if (data.secret) {
            // Only allow updates if new secret is last secret
            if (data.secret == req.secret) {
                // good to go.
            } else {
                var error = RoutingError("Metadata for token " + this.params.token + " already exists with a defined secret.", 500);
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(error));
            }
        }
        var error = RoutingError("Metadata for token " + this.params.token + " already exists.", 500);
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(error));
    } else {
        var insert = req;
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
