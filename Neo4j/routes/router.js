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
			//TODO	Have the Client WS messages send the API call in a serialized object and have this funtion
			//TODO	(or make the call to that function from here) make the GET call and async the results back via ws.send()
			// ws.send();
		});
		ws.on("close", function() {
			
		});
	});
};

export default router;