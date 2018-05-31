const sql = require('mssql');
const RegEx = new (require("./RegEx"))();

const Error = {
	IsInvalid: "[Error]"
};

class TSQL {
	constructor(config) {
		this.Config = config;
		this.DataType = {
			DEFAULT: "DEFAULT",
			NULL: "NULL"
		};
	}
	
	ConnectionPool(res, query, txfn) {
		return new sql.ConnectionPool({
			user: this.Config.DB.User,
			password: this.Config.DB.Password,
			server: this.Config.DB.Server,
			database: this.Config.DB.Database,
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

	Parameterize(array, escapeDepth = 1) {
		let CheckSet = [];
		array.filter((v, i) => {
			return v.length === 2;
		}).forEach((v, i) => {
			CheckSet.push(v[0]);
			CheckSet.push(v[1]);
		});

		let InputSet = array.map((v, i) => {
			if(v.length === 2) {
				let s = "'".repeat(escapeDepth);
				switch(v[1].toString()) {
					case RegEx.Rules.UUID.toString():
						return `${s}${v[0]}${s}`;
					default:
						return v[0];
				}
			}

			return v[0];
		});

		return {
			CheckSet,
			InputSet
		};
	}

	TVF(req, res, name, ...rest) {
		let para = this.Parameterize(rest);
		
		if(!RegEx.IsValid(...para.CheckSet)) {
			res.status(500).send({ message: Error.IsInvalid});
		}

		let query = `SELECT * FROM ${this.Config.DB.Database}.${this.Config.DB.Schema}.[${name}](${para.InputSet.join(",")});`;
		
		this.ConnectionPool(res, query, (results) => {
			return results;
		});
	}
}

module.exports = TSQL;