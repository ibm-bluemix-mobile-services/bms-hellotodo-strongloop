var packageVersion = require('./../package.json').version;
console.log("packageVersion :: " + packageVersion);

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

// ------------ Protecting mobile backend with App ID start -----------------

// Load passport (http://passportjs.org)
var passport = require('passport');

// Get the App ID passport strategy to use
var APIStrategy = require('bluemix-appid').APIStrategy;

// Tell passport to use the App ID strategy
passport.use(new APIStrategy())

// Tell application to use passport
app.use(passport.initialize());

// Protect DELETE endpoint so it can only be accessed by HelloTodo mobile samples
app.delete('/api/Items/:id', passport.authenticate(APIStrategy.STRATEGY_NAME, {session: false}));

// Protect /protected endpoint which is used in Getting Started with Bluemix Mobile Services tutorials
app.get('/protected', passport.authenticate(APIStrategy.STRATEGY_NAME, {session: false}), function(req, res){
	res.send("Hello, this is a protected resouce of the mobile backend application!");
});
// ------------ Protecting backend APIs with App ID end -----------------

app.start = function () {
	// start the web server
	return app.listen(function () {
		app.emit('started');
		var baseUrl = app.get('url').replace(/\/$/, '');
		console.log('Web server listening at: %s', baseUrl);
		var componentExplorer = app.get('loopback-component-explorer');
		if (componentExplorer) {
			console.log('Browse your REST API at %s%s', baseUrl, componentExplorer.mountPath);
		}
	});
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
	if (err) throw err;
	if (require.main === module)
		app.start();
});

