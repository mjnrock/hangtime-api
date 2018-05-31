const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mssql = require("mssql");

const Config = require("./config");
const Router = require("./routes/router");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
Router(app, Config);

app.listen(Config.Server.Port, () => {
	console.log(`Hangtime API is now listening on port: ${Config.Server.Port}`);
});