class Post {
	constructor(sender, receiver, payload, timestamp = Date.now()) {
		this.Sender = sender;
		this.Receiver = receiver;
		this.Payload = payload;

		this.Timestamp = timestamp;
	}
}