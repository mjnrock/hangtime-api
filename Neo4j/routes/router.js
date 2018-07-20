import Neo4j from "./../ht/Helper/Neo4j";
import Message from "./../ht/Message";
import ConnectionManager from "./../ht/ConnectionManager";
import { GetMessage } from './../ht/Message/GetMessage';

const router = (App, Drivers) => {
	const DB = new Neo4j(Drivers.Neo4j);

	App.post("/feed/:feed/w", function (req, res) {
		let feed = req.params.feed,
			author = req.body.author,
			payload = req.body.payload,
			timestamp = Date.now();

		console.log(req.body);
		DB.SendJSON(...DB.Basic(res, "neo4j", "password", [
			`MERGE (m:Message {Author: $author, Payload: $payload, Timestamp: $timestamp})`,	// MERGE here with timestamp binding for pseudo idempotency
			`RETURN m`
		], {
			author: author,
			payload: payload,
			timestamp: timestamp
		}));
	});
	App.get("/feed/:feed/r", function (req, res) {
		let feed = req.params.feed,
			l = +req.query.l || 50;	// Limit

		let Label = "Message";
		DB.SendJSON(...DB.Basic(res, "neo4j", "password", [
			`MATCH (m:${Label})`,
			`RETURN m`,
			`ORDER BY m.Timestamp ASC`
		]));
	});

	App.get("/validate", function (req, res) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).send("This is a validation message from the Hangtime Graph API");
	});

	App.ws("/ws", function (ws, req) {
		ws.on("connection", function(conn) {
			console.log(1234);
		});
		ws.on("message", function(msg) {
			//!	Debugging
			console.log(ws._socket.address());

			//TODO	Have the Client WS messages send the API call in a serialized object and have this funtion
			//TODO	(or make the call to that function from here) make the GET call and async the results back via ws.send()
			
			const message = JSON.parse(msg);
			switch(message.Type) {
				case "INITIALIZE_FEED":

					//! Make the `App.get("/feed/:feed/r")` call here
					let Label = "Message";
					let Response = DB.Basic(null, "neo4j", "password", [
						`MATCH (m:${Label})`,
						`RETURN m`,
						`ORDER BY m.Timestamp ASC`
					]);
					Response[3].then(result => {
						Response[0].close();
			
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
						
						Response[1].close();
						ws.send(JSON.stringify({
							Type: "INITIALIZE_FEED",
							Payload: result
						}));
					});

					break;
				default:
					break;
			}
		});
		ws.on("close", function() {
			
		});
	});
};

export default router;