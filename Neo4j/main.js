const express = require("express");
const app = express();
const bodyParser = require("body-parser");

import Router from "./routes/router.js";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
Router(app);

app.listen(1337, () => {
	console.log(`Hangtime API is now listening on port: 1337`);
});