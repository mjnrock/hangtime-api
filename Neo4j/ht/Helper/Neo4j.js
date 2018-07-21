class Neo4j {
	constructor(module) {
		this.WebSocketServer = null;

		this.SetProtocol("bolt");
		this.SetServer("localhost");

		this.SetModule(module);
	}

	GetProtocol() {
		return this.protocol;
	}
	SetProtocol(protocol) {
		this.protocol = protocol;

		return this;
	}

	GetServer() {
		return this.server;
	}
	SetServer(server) {
		this.server = server;

		return this;
	}

	GetWebSocketServer() {
		return this.WebSocketServer;
	}
	SetWebSocketServer(wss) {
		this.WebSocketServer = wss;

		return this;
	}

	GetURL() {
		return `${this.protocol}://${this.server}`;
	}

	GetModule() {
		return this.module;
	}
	SetModule(module) {
		this.module = module;

		return this;
	}
	
	Basic(name, password, query, params = null) {
		const driver = this.GetModule().driver(this.GetURL(), this.GetModule().auth.basic(name, password));
		const session = driver.session();	
		const result = session.run(Array.isArray(query) ? query.join(" ") : query, params);

		return [session, driver, result];
	}

	SendJSON(res, session, driver, result, cors = true) {		
		result.then(result => {
			session.close();

			result = result["records"].map((v, i) => {
				// //! Being unfamiliar with Neo4j, I'm not sure when/why a query will return more than 1 set for the "_fields" array,
				// //! but this preserves the return order if more than index 0 is needed
				// let fields = {};
				// v["_fields"].forEach((field, j) => {
				// 	fields[j] = {
				// 		Labels: field["labels"],
				// 		Values: field["properties"]
				// 	};
				// });

				return {
					Labels: v["_fields"][0]["labels"],
					Values: v["_fields"][0]["properties"]
				};
			});
			
			if(cors === true) {
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
				res.setHeader("Access-Control-Allow-Credentials", false);
				res.setHeader("Access-Control-Age", "86400");
				res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
			}
			res.set("Content-Type", "Application/json");
			res.status(200).send(result);
			
			driver.close();
		});
	}

	//? This should probably be moved to the ConnectionManager, so that state and connection status can be monitored and sent to appropriate clients
	SendWS(ws, type, session, driver, result) {		
		result.then(result => {
			session.close();

			result = result["records"].map((v, i) => {
				return {
					Labels: v["_fields"][0]["labels"],
					Values: v["_fields"][0]["properties"]
				};
			});
			
			driver.close();

			//! To send to every Client
			this.WebSocketServer.clients.forEach((client) => {
				//TODO Discriminate which clients should actually receive this, as opposed to literally all
				client.send(JSON.stringify({
					Type: type,
					Payload: result
				}));
			});

			//! To send to the invoking client
			// ws.send(JSON.stringify({
			// 	Type: type,
			// 	Payload: result
			// }));
		});
	}
}

Neo4j.GetInstance = new Neo4j();

export default Neo4j;