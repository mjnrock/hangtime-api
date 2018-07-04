class Neo4j {
	constructor(module) {
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
	
	Basic(res, name, password, query, params = null) {
		const driver = this.GetModule().driver(this.GetURL(), this.GetModule().auth.basic(name, password));
		const session = driver.session();	
		const result = session.run(Array.isArray(query) ? query.join(" ") : query, params);

		return [session, driver, res, result];
	}

	SendJSON(session, driver, response, result, cors = true) {		
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
				response.setHeader("Access-Control-Allow-Origin", "*");
			}
			response.set("Content-Type", "Application/json");
			response.status(200).send(result);
			
			driver.close();
		});
	}
}

Neo4j.GetInstance = new Neo4j();

export default Neo4j;