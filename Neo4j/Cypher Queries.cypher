//	Remember to load APOC into Neo4j

//	Add an [Author] relationship to (Message {Timestamp: 1520864887505})
MATCH (u:User {Username: "brgh8553"}), (m:Message {Timestamp: 1520864887505})
MERGE (u)-[:AUTHOR]->(m)

//	Delete [Author] relationships where (User {Username: "brgh8553"})
MATCH (u:User {Username: "brgh8553"})-[r:AUTHOR]-(m:Message)
DETACH DELETE r

//	Match all (Message)s where a (User) is the [Author] and the (Channel {Label: "Business Intelligence"}) is the [Recipient]
MATCH (c:Channel {Label: "Business Intelligence"})<-[:RECIPIENT]-(m:Message)<-[:AUTHOR]-(u:User)
RETURN c.Label AS Channel, u.Username AS Username, m.Payload AS Message, m.Timestamp AS MessageCreatedDT

//	Match all (Message)s where a (User) is the [Author]
MATCH (m:Message)-[:AUTHOR]->(u:User)
RETURN u.Username, m.Payload, m.Timestamp

//	Insert a (Message) and assign it an [Author] and a [Recipient] (Channel)
MATCH (c:Channel {Label: "Business Intelligence"}), (u:User {Username: "ayersjm"})
MERGE (u)-[:AUTHOR]->(m:Message {Payload: "This is another test message", Timestamp: TIMESTAMP()})-[:RECIPIENT]->(c)

	//	Another version of above
	MATCH (c:Channel {Code: "SJMO-BI"}), (u:User {Username: "ayersjm"})
	MERGE (u)-[:AUTHOR]->(m:Message {Payload: "This is an API test message", Timestamp: TIMESTAMP()})-[:RECIPIENT]->(c)

//	Delete (Channel)s without a @Label
MATCH (c:Channel)
WHERE NOT (EXISTS (c.Label))
DETACH DELETE c

//	Assign all (User)s as [Member]s to a (Channel)
MATCH (c:Channel {Label: "Business Intelligence"}), (u:User)
CREATE (u)-[:MEMBER]->(c)

//	Create an Index on (User) on @Username
CREATE INDEX ON :User(Username)

//	Add a (Channel)
MERGE (:Channel {Label: "Business Intelligence", Description: "The main Business Intelligence channel"})

//	Add properties @ to a (User)
MERGE (n:User {Username: "ayersjm"}) SET n += {FirstName: "Jeff", LastName: "Ayers"}

//	Delete a node () and remove any relationship [] attachments
MATCH (n {FirstName: "Matt", Username: "brgh8553"})
DETACH DELETE n