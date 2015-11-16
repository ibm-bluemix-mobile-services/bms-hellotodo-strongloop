var express = require('express');
var cfenv = require('cfenv');

var app = express();

app.get("/", function (req, res) {
	res.send("RESPONSE!");
});

app.listen(cfenv.getAppEnv().port, function() {
	console.log("server started on " + cfenv.getAppEnv().url);
});