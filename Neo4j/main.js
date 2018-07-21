const express = require("express");
const bodyParser = require("body-parser");
const neo4j = require("neo4j-driver").v1;

const expressWS = require("express-ws")(express());
const app = expressWS.app;

const PORT = 1337;

import Router from "./routes/Router";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
Router(app, {
	Neo4j: neo4j,
	WebSocket: expressWS
});

app.listen(PORT, () => {
	console.log(`Hangtime Graph API is now listening on port: ${PORT}`);
});