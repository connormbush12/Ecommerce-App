const fs = require('fs');
const crypto = require('crypto');

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
		return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
	}
	async create(attributes) {
		attributes.id = this.randomID();
		const records = await this.getAll();
		records.push(attributes);
		await this.writeAll(records);
	}
	async writeAll(records) {
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}
	randomID() {
		return crypto.randomBytes(4).toString('hex');
	}
	//Now we create a getOne() function that finds a user based on the ID
	async getOne(id) {
		//First, we want to get all of our users
		const records = await this.getAll();
		//Then, we will return the one user whose ID matches our input
		//To do this, we use the array callback method .find(), pass through our records, and return once it finds the correct ID
		return records.find((records) => records.id === id);
	}
}
const test = async () => {
	const repository = new UsersRepository('users.json');
	//To test this, we make a variable for a user, use the .getOne method, and take an ID from our users.json file
	const user = await repository.getOne('e45698cf');
	//Then, we console.log() it
	console.log(user);
};

test();
