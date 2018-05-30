const router = (app, Config) => {
	app.get("/test", (req, res, next) => {
		console.log(Config);
	});
}

module.exports = router;