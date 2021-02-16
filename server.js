const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/game/:activity', function (req, res) {
//     let activity = req.params.activity,
//         p = req.query.p,	//	Latitude (Phi)
//         l = req.query.l,	//	Longitude (Lambda)
//         r = +req.query.r || 16000;	//	Radius (meters)	[16000m ~= 10mi]
//         //tags = req.query.t;	//TODO Not an MVP feature

//     TSQL.TVF(req, res, `GET.ProximateGames`,
//         [activity, RegEx.Rules.String.AlphaNum],
//         [p, RegEx.Rules.Numeric.Latitude],
//         [l, RegEx.Rules.Numeric.Longitude],
//         [r, RegEx.Rules.Numeric.Real],
//         [TSQL.DataType.DEFAULT]
//     );
// });
app.get("/test", function (req, res) {
    res.json({
        response: "Verified",
    });
});

app.listen(3001, () => {
	console.log(`Hangtime API is now listening on port: ${ 3001 }`);
});