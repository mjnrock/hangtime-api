import Neo4j from "./../ht/Helper/Neo4j";
import Message from "./../ht/Message";

const router = (App, Drivers) => {
	const DB = new Neo4j(Drivers.Neo4j);

	App.post("/feed/:feed/w", function (req, res) {
		let feed = req.params.feed,
			author = req.body.author,
			payload = req.body.payload,
			timestamp = Date.now();

		DB.SendJSON(...DB.Basic(res, "neo4j", "password", [
			`MERGE (m:Message {Author: $author, Payload: $payload, Timestamp: toString($timestamp)})`,	// MERGE here with timestamp binding for pseudo idempotency
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
};

export default router;