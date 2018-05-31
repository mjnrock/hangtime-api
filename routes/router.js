const RegEx = new (require("../helper/RegEx"))();
const ERROR = -1;

const router = (app, Config) => {
	const TSQL = new (require("../helper/TSQL"))(Config);

	app.get("/verify", (req, res, next) => {
		TSQL.ConnectionPool(res, `SELECT GETDATE() AS 'Now'`);
	});

	//	http://localhost:3005/s/18E7D142-3545-4867-9011-3B539EA53845?p=42.778011&l=-83.266654&r=500
	app.get('/s/:activity', function (req, res) {
		let activity = req.params.activity,
			p = req.query.p,	//	Latitude (Phi)
			l = req.query.l,	//	Longitude (Lambda)
			r = req.query.r;	//	Radius (meters)
			
			//TODO Not an MVP feature
			//	tags = req.query.t;

		TSQL.TVF(req, res, "GetProximateGames", 
			[activity, RegEx.Rules.UUID],
			[3, RegEx.Rules.Numeric.Integer],
			[p, RegEx.Rules.Numeric.Latitude],
			[l, RegEx.Rules.Numeric.Longitude],
			[r, RegEx.Rules.Numeric.Real],
			[TSQL.DataType.DEFAULT],
			[TSQL.DataType.DEFAULT]
		);
	});
};

module.exports = router;