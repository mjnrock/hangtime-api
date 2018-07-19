class ConnectionManager {
	constructor() {
		console.log(1);
	}

	Verify() {
		console.log("VERIFIED");
	}
}

ConnectionManager.GetInstance = () => new ConnectionManager();

export default ConnectionManager;