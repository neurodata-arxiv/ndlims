

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


Router.route('/metadata/ocp/set/:token', {where: 'server'})
.post(function () {
    var req = this.request.body;
	var res = this.response;

    var data = OCPMetadata.findOne({token: this.params.token});

    if (data) {
        // is there a secret specified?
        if (data.secret) {
            // they must either have the secret,
            // or throw an error.
            if (req.secret == data.secret) {
                // good to go!
                var insert = req;
                insert.token = this.params.token;
                insert._updated = new Date();
                data = _(data).extend(insert);
                var id = OCPMetadata.update(data._id, data);
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
            } else {
                // throw bad secret error
                var error = RoutingError("Metadata for token " + this.params.token + " cannot be updated: Bad secret.", 500);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(error));
            }
        } else {
            // throw read only error
            var error = RoutingError("Metadata for token " + this.params.token + " is read-only.", 500);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(error));
        }
    } else {
        // good to go!
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
