const RegEx = new (require("../helper/RegEx"))();
const ERROR = -1;

const router = (app, Config) => {
	const TSQL = new (require("../helper/TSQL"))(Config);

	app.get("/verify", (req, res, next) => {
		TSQL.ConnectionPool(res, `SELECT SYSUTCDATETIME() AS 'Now'`);
	});

	//	http://localhost:3005/s/{{ACTIVITY_UUID}}?p=42.778011&l=-83.266654&r=500
	//	http://localhost:3005/s/{{ACTIVITY_UUID}}?p=42.2411&l=-83.6130
	app.get('/game/:activity', function (req, res) {
		let activity = req.params.activity,
			p = req.query.p,	//	Latitude (Phi)
			l = req.query.l,	//	Longitude (Lambda)
			r = +req.query.r || 16000;	//	Radius (meters)	[16000m ~= 10mi]
			//tags = req.query.t;	//TODO Not an MVP feature

		TSQL.TVF(req, res, `GET.ProximateGames`,
			[activity, RegEx.Rules.UUID],
			[p, RegEx.Rules.Numeric.Latitude],
			[l, RegEx.Rules.Numeric.Longitude],
			[r, RegEx.Rules.Numeric.Real],
			[TSQL.DataType.DEFAULT]
		);
	});
	
	app.get('/user/:input', function (req, res) {
		let input = req.params.input,
			it = +req.query.it || 1	//	Input Type (1: Username, 3: UUID)
			s = +req.query.s || 0;		//	Switch (0: Basic, 1: Extended)

		TSQL.TVF(req, res, `GET.${s === 1 ? "UserExtended" : "UserBasic"}`,
			[input, it === 3 ? RegEx.Rules.UUID : RegEx.Rules.String.AlphaNum],
			[it, RegEx.Rules.Numeric.Integer]
		);
	});
};

module.exports = router;