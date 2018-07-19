import { AMessage } from './AMessage';
import MessageType from '../Enum/MessageType';

export class GetMessage extends AMessage {
	constructor(recipient, payload) {
		super(MessageType.GET, "Server", recipient, payload);
	}
}