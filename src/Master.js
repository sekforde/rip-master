const socket = require('socket.io');
const Connection = require('./Connection');

class Master {
	constructor(port = 3300) {
		this.port = port;
		this.server = socket();
		this.server.on('connection', this.onConnection.bind(this));
		this.connHash = {};
		this.connectionIds = [];
		this.connections = 0;
	}
	listen() {
		console.log(`Server Listening on ${this.port}`);
		this.server.listen(this.port);
	}
	showConnections() {
		this.connectionIds = Object.keys(this.connHash);
		this.connections = this.connectionIds.length;
		console.log('Total connections', this.connections);
	}
	onConnection(conn) {
		console.log('\n');
		const newConnection = new Connection(conn);
		newConnection.on('disconnect', this.onDisconnect.bind(this));
		this.connHash[newConnection.id] = newConnection;
		this.showConnections();
	}
	onDisconnect(id) {
		console.log('closing connection to', id);
		delete this.connHash[id];
		this.showConnections();
	}
	federateJob(file, pageCount) {
		console.log('Federating Job', file, pageCount);
		const pageBlockSize = pageCount / this.connections;
		this.connectionIds.forEach((connectionId, blockIndex) => {
			const connection = this.connHash[connectionId];
			const pageRange = `${(blockIndex * pageBlockSize) + 1}-${(blockIndex + 1) * pageBlockSize}`;
			connection.startJob(file, pageRange);
		});
	}
}

module.exports = Master;
