const router = (app, config) => {
	app.get("/test", (req, res, next) => {
		console.log(config);
	});
}

module.exports = router;