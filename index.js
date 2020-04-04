const Master = require('./src/Master');

const main = () => {
	console.clear();
	const master = new Master();
	master.listen();
	setTimeout(() => {
		master.federateJob('files/comic.pdf', 4);
	}, 5000);
};

main();
