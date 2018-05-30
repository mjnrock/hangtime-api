const router = (app, Config) => {
	app.get("/test", (req, res, next) => {
		let sql = require("mssql");

		new sql.ConnectionPool({
			user: Config.DB.User,
			password: Config.DB.Password,
			server: Config.DB.Server,
			database: Config.DB.Database,
			encrypt: true
		}, err => {
			let request = new sql.Request();

			request.query("SELECT * FROM Hangtime.[User]", (err, result) => {
				console.log(request);
				console.log(result);
				res.send(result);
			});
		});
	});
};

module.exports = router;