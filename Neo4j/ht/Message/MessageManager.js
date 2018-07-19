class MessageManager {
	constructor() {
		this.Messages = [];
		this.Random = Math.random();	//? Debugging feature to ensure GetInstance is the same for now
	}

	Receive(message) {
		this.Messages.push(message);

		return this;
	}

	Deliver(message) {
		return `[${Date.now()} | MessageManager.js | Deliver]: ${JSON.stringify(message)}`;
	}

	//TODO Clearing this cache needs to be regulated by some resource-dependent governor, such that it doesn't block or hold
	Dispatch() {
		let comments = [];
		comments.push(`[${Date.now()} | MessageManager.js | Dispatch]: ${this.Messages.length}`);
		this.Messages.reverse();	// Probably expense at scale, come up with good way to cheaply (and accurately) forward loop
		for (var i = this.Messages.length - 1; i >= 0; i--) {
			comments.push(this.Deliver(this.Messages[i]));
			this.Messages.splice(i, 1);
		}

		return comments;
	}
}

MessageManager.GetInstance = () => new MessageManager();

export default MessageManager;