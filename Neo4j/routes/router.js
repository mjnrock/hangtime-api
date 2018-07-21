import Neo4j from "./../ht/Helper/Neo4j";
import MessageType from "../ht/Enum/MessageType";

const DAILY_MILLISECONDS = 8.64e+7;

//TODO This is still in Proof of Concept phase and needs to be substantially refactored into proper classes and imports and such
const router = (App, Drivers) => {
	const DB = new Neo4j(Drivers.Neo4j);
	DB.SetWebSocketServer(Drivers.WebSocket.getWss());

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

		DB.SendJSON(res, ...GETFeed(DB, feed, l));
	});

	App.get("/validate", function (req, res) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).send("This is a validation message from the Hangtime Graph API");
	});

	App.ws("/ws", function (client, req) {
		client.on("connection", function(conn) {});
		client.on("message", function(msg) {
			//TODO This stuff absolutely needs to be offloaded to a ConnectionManager to help verify client sends (e.g. if A POSTs and B is online and in same group, send to A and B)
			//TODO It also needs to be encapsulated in functions so that API landing points invoke a function instead
			//TODO Make sure that messages are sent to multiple clients if applicable (e.g. a Feed Post)

			const message = JSON.parse(msg);

			//!	Debugging
			console.log(client._socket.address());
			console.log(client.clients);
			console.log(message);

			switch(message.Type) {
				case MessageType.INITIALIZE_FEED:
					//! Make the `App.get("/feed/:feed/r")` call here
					//TODO Offload the DB.SendWS to the ConnectionManager
					DB.SendWS(client, message.Type,
						...GETFeed(DB,
							message.Data.ID
						)
					);
					break;
				case MessageType.WRITE_POST_MESSAGE:
					//! Make the `App.post("/feed/:feed/w")` call here
					//TODO Offload the DB.SendWS to the ConnectionManager
					DB.SendWS(client, message.Type,
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
		client.on("close", function() {});
	});
};

//TODO Move this to a class so that the DB and/or Drivers can be readily passed to it
function GETFeed(DB, feed, limit = 250) {
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

//TODO Move this to a class so that the DB and/or Drivers can be readily passed to it
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