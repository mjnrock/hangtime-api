import Neo4j from "./../ht/Helper/Neo4j";
import Message from "./../ht/Message";

const router = (App, Drivers) => {
	const DB = new Neo4j(Drivers.Neo4j);

	App.post("/feed/:feed/w", function (req, res) {
		let feed = req.params.feed,
			author = req.body.author,
			payload = req.body.payload;

		DB.SendJSON(...DB.Basic(res, "neo4j", "password", [
			`MERGE (m:Message {Author: $author, Payload: $payload, Timestamp: TIMESTAMP()})`,
			`RETURN m`
		], {
			author: author,
			payload: payload
		}));
	});
	App.get("/feed/:feed/r", function (req, res) {
		let feed = req.params.feed,
			l = +req.query.l || 50;	// Limit

		let Label = "Message";
		DB.SendJSON(...DB.Basic(res, "neo4j", "password", [
			`MATCH (m:${Label})`,
			`RETURN m`
		]));
	});

	App.get("/validate", function (req, res) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).send("This is a validation message from the Hangtime Graph API");
	});
};

export default router;