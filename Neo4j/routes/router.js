import Neo4j from "./../ht/Helper/Neo4j";
import MessageType from "../ht/Enum/MessageType";

const DAILY_MILLISECONDS = 8.64e+7;

const router = (App, Drivers) => {
	const DB = new Neo4j(Drivers.Neo4j);

	App.post("/feed/:feed/w", function (req, res) {
		let feed = req.params.feed,
			author = req.body.author,
			payload = req.body.payload,
			timestamp = Date.now();

		DB.SendJSON(res, ...POSTFeedPost(DB, feed, author, payload, timestamp));
	});
	App.get("/feed/:feed/r", function (req, res) {
		let feed = req.params.feed,
			l = +req.query.l || 50;	// Limit

		DB.SendJSON(res, GETFeed(DB, feed, l));
	});

	App.get("/validate", function (req, res) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).send("This is a validation message from the Hangtime Graph API");
	});

	App.ws("/ws", function (ws, req) {
		ws.on("connection", function(conn) {});
		ws.on("message", function(msg) {
			//TODO This stuff absolutely needs to be offloaded to a Manager to help verify client sends (e.g. if A POSTs and B is online and in same group, send to A and B)
			//TODO It also needs to be encapsulated in functions so that API landing points invoke a function instead
			//TODO Make sure that messages are sent to multiple clients if applicable (e.g. a Feed Post)

			const message = JSON.parse(msg);

			//!	Debugging
			console.log(ws._socket.address());			
			console.log(message);

			switch(message.Type) {
				case MessageType.INITIALIZE_FEED:
					//! Make the `App.get("/feed/:feed/r")` call here
					DB.SendWS(ws, message.Type,
						...GETFeed(DB,
							message.Data.ID
						)
					);
					break;
				case MessageType.WRITE_POST_MESSAGE:
					//! Make the `App.post("/feed/:feed/w")` call here
					DB.SendWS(ws, message.Type,
						...POSTFeedPost(DB,
							message.Data.ID,
							message.Data.Author,
							message.Data.Message,
							message.Timestamp
						)
					);
					break;
				default:
					break;
			}
		});
		ws.on("close", function() {});
	});
};


function GETFeed(DB, feed, limit = 250) {
	console.log(Date.now(), Date.now() - 8.64e+7);
	return DB.Basic("neo4j", "password", [
		`MATCH (m:Message)`,
		`WHERE m.Timestamp >= ${Date.now() - 2 * DAILY_MILLISECONDS}`,		// Minus (exactly) 48 hours
		`RETURN m`,
		`ORDER BY m.Timestamp ASC`,
		`LIMIT $limit`
	], {
		limit: limit
	});
}

function POSTFeedPost(DB, feed, author, payload, timestamp) {
	return DB.Basic("neo4j", "password", [
		`MERGE (m:Message {Author: $author, Payload: $payload, Timestamp: $timestamp})`,	// MERGE here with timestamp binding for pseudo idempotency
		`RETURN m`
	], {
		author: author,
		payload: payload,
		timestamp: timestamp
	})
}

export default router;