import MessageManager from './MessageManager';

export class AMessage {
	constructor(messageType, sender, receiver, data) {
		this.Type = messageType;
		this.Sender = sender;
		this.Receiver = receiver;
		this.Data = data;
		this.Timestamp = Date.now();
	}

	Send(i) {
		MessageManager.GetInstance.Receive({
			i: i,
			...this
		});
	}
}