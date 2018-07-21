const express = require("express");
const app = express();
const PORT = 1337;

const neo4j = require("neo4j-driver").v1;

app.get("/", (req, res) => {
	res.send("This is the Hangtime Graph API");
});

app.get("/channel/:code", (req, res) => {
	const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "password"));
	const session = driver.session();
	
	const SQL = [
		`MATCH (c:Channel {Code: $code})<-[:RECIPIENT]-(m:Message)<-[:AUTHOR]-(u:User)`,
		`RETURN c.Label AS Channel, u.Username AS Username, m.Payload AS Message, m.Timestamp AS MessageCreatedDT`,
		`ORDER BY MessageCreatedDT DESC`
	];

	const result = session.run(
		SQL.join(" "),
		{
			code: req.params.code.toUpperCase()
		}
	);
	
	result.then(result => {
		session.close();
		
		let json = [];
		let keys = result.records[0].keys;
		result.records.map((o, i) => {
			let record = [];
			keys.forEach(k => {
				if(k === "MessageCreatedDT") {
					record.push(neo4j.integer.toNumber(o.get(k)));
				} else {
					record.push(o.get(k));
				}
			});
			json.push(record);
		});
		
		res.set("Content-Type", "application/json");
		res.send(json);
		
		driver.close();
	}).catch(e => console.log(e));
});

app.listen(PORT, () => console.log(`Hangtime Graph API listening on port ${PORT}!`));