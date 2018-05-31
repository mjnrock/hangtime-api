const sql = require('mssql');
const RegEx = new (require("../helper/RegEx"))();

const router = (app, Config) => {
	const TVF = (name, ...rest) => {
		return `SELECT * FROM ${Config.DB.Database}.${Config.DB.Schema}.[${name}](${rest.join(",")})`;
	};

	const ConnectionPool = (res, query, txfn) => {
		return new sql.ConnectionPool({
			user: Config.DB.User,
			password: Config.DB.Password,
			server: Config.DB.Server,
			database: Config.DB.Database,
			port: 1433,
			encrypt: true
		}).connect().then(pool => {
			return pool.request().query(query);
		}).then(result => {
			let rows = result.recordset;
			if(typeof txfn === 'function') {
				let txrows = txfn(rows);
				if(txrows !== void 0 && txrows !== null) {
					rows = txrows;
				}
			}
			
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.status(200).send(rows);
			sql.close();
		}).catch(err => {
			res.status(500).send({ message: `${err}`});
			sql.close();
		});
	}

	app.get("/verify", (req, res, next) => {
		ConnectionPool(res, `SELECT GETDATE() AS 'Now'`);
	});

	app.get('/s/:activity', function (req, res) {
		let activity = req.params.activity,
			p = req.query.lat,	//	Latitude (Phi)
			l = req.query.lat,	//	Longitude (Lambda)
			r = req.query.lat;	//	Radius (meters)
			
			//TODO Not an MVP feature
			//	tags = req.query.t;
		
		if(!RegEx.IsValid(
			activity, RegEx.Rules.UUID,
			p, RegEx.Rules.Numeric.Latitude,
			l, RegEx.Rules.Numeric.Longitude,
			r, RegEx.Rules.Numeric.Real
		)) {
			res.send("[Error]");

			return 0;
		}

		console.log(TVF("GetProximateGames", 1, 2, 3));
		let query = `SELECT * FROM ${Config.DB.Database}.${Config.DB.Schema}.[GetProximateGames]`;
		query = query.replace(/[-;]/g, "");
	
		// ConnectionPool(res, query, (results) => {
		// 	return results;
		// });
	});
};

module.exports = router;