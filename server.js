const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mssql = require("mssql");

const config = require("./config");
const router = require("./routes/router");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
router(app, config);

app.listen(config.Server.Port, () => {
	console.log(`Hangtime server is now listening on port: ${config.Server.Port}`);
});