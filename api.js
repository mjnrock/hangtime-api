const express = require("express");
const app = express();
const mssql = require("mssql");

const CONFIG = require("./config");
const PORT = CONFIG.Port;

app.listen(PORT, () => {
	console.log(`Hangtime server is now listening on port: ${PORT}`);
});

app.get("/test", (req, res, next) => {
	console.log(CONFIG);
});