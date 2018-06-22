import MessageManager from './../ht/Message/MessageManager';
import { ChildMessage } from './../ht/Message/ChildMessage';

const router = (app) => {	
	app.get('/user/:input', function (req, res) {
		let input = req.params.input;
			// it = +req.query.it || 1	
			// s = +req.query.s || 0;

		(new ChildMessage()).Send(1);
		(new ChildMessage()).Send(2);
		(new ChildMessage()).Send(3);
		(new ChildMessage()).Send(4);

		MessageManager.GetInstance.Dispatch();

		res.setHeader('Access-Control-Allow-Origin', '*');
		res.status(200).send("cat");
	});
};

export default router;