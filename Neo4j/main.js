const express = require("express");
const bodyParser = require("body-parser");
const neo4j = require("neo4j-driver").v1;

const app = express();
const PORT = 1337;

import Router from "./routes/router.js";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
Router(app, {
	Neo4j: neo4j
});

app.listen(PORT, () => {
	console.log(`Hangtime Graph API is now listening on port: ${PORT}`);
});