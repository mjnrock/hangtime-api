import Post from './Post';

class Feed {
	constructor() {}

	ReadPost(message) {

	}
	WritePost(message) {

	}

	SerializePost(post) {
		return JSON.stringify(post);
	}
	DeserializePost(post) {
		if(post !== null && post !== void 0) {
			let p = JSON.parse(post);

			return new Post(p.Sender, p.Receiver, p.Payload, p.Timestamp);
		}
	}
}

Feed.GetInstance = new Feed();

export default Feed;