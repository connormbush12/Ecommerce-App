const fs = require('fs');

class UsersRepository {
	constructor(filename) {
		if (!filename) {
			throw new error('Creating a repository requires a filename');
		}
		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}
	async getAll() {
		//Now, we want to parse the data, return it, and refactor it into one line of code.
		//To parse it, we simply wrap the data in JSON.parse()
		//Then, instead of saving it to a variable and returning that varibale, we simply return this line of code
		return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
	}
}
const test = async () => {
	const repository = new UsersRepository('users.json');
	//Within our test function, we save this returned info into a users variable and console.log() it to check that it's working
	const users = await repository.getAll();
	console.log(users);
};

test();
