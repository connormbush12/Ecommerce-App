const fs = require('fs');
//To make the randomID method, first we require in the crypto external library
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
		//Now that we have our randomID method, we make an ID attribute in our attribute object whenever we create a user account
		attributes.id = this.randomID();
		const records = await this.getAll();
		records.push(attributes);
		await this.writeAll(records);
	}
	async writeAll(records) {
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}
	//Now, we create a randomID method
	randomID() {
		//We use the crypto external library and the randomBytes() method to create a string of four random Buffer bytes of info. We then use .toString to convert that into a hex string.
		return crypto.randomBytes(4).toString('hex');
	}
}
const test = async () => {
	const repository = new UsersRepository('users.json');
	await repository.create({ username: 'coolcon@hotmail.com', password: 'cooldaddycon' });
	const users = await repository.getAll();
	console.log(users);
};

test();
