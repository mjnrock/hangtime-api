import { AMessage } from './AMessage';

export class ChildMessage extends AMessage {
	constructor(recipient, payload) {
		super("CHILD_MESSAGE", "Server", "Player");
	}
}