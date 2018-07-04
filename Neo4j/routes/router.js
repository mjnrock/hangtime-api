import Message from './../ht/Message';

const router = (app) => {	
	app.get('/user/:input', function (req, res) {
		let input = req.params.input;
			// it = +req.query.it || 1	
			// s = +req.query.s || 0;

		(new Message.ChildMessage()).Send(1);
		(new Message.ChildMessage()).Send(2);
		(new Message.ChildMessage()).Send(3);
		(new Message.ChildMessage()).Send(4);

		let value = Message.MessageManager.GetInstance.Dispatch().join("<br />");
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.status(200).send(value);
	});
};

export default router;