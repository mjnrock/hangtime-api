import { AMessage } from './AMessage';
import MessageType from '../Enum/MessageType';

export class ChildMessage extends AMessage {
	constructor(recipient, payload) {
		super(MessageType.MESSAGE_A, "Server", "Player");
	}
}