const EventEmitter = require('events');

class Connection extends EventEmitter {
	constructor(conn) {
		super();
		this.socketConn = conn;
		this.id = conn.id;

		console.log(`New client connection from ${this.id}`);

		this.socketConn.on('connect', this.onConnect.bind(this));
		this.socketConn.on('error', this.onError.bind(this));
		this.socketConn.on('disconnect', this.onDisconnect.bind(this));
		this.socketConn.on('complete', this.onComplete.bind(this));
	}
	onConnect() {
		console.log(`Connection from ${this.id}`);
	}
	onDisconnect() {
		console.log(`Connection from ${this.id} disconnected`);
		this.emit('disconnect', this.id);
	}
	onError(err) {
		console.log(`Connection ${this.id}`);
		console.error(err.message);
	}
	onComplete(data) {
		console.log('Job complete', data.name);
	}
	startJob(file, pageRange) {
		console.log('starting job', file, pageRange, 'on', this.id);
		this.socketConn.emit('start', {
			file,
			pageRange
		});
	}
}

module.exports = Connection;
