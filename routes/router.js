const router = (app, Config) => {
	app.get("/test", (req, res, next) => {
		res.json(Config);
	});
}

module.exports = router;