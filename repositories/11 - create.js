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
		return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
	}
	//Next, we want to create our create() method that creates a new user
	//Instead of requiring specific user account info like username, password, etc., we will pass through an attribute object that allows us to vary the user account info we need
	async create(attributes) {
		//First, we want to get all of our users and save it as a record
		const records = await this.getAll();
		//Then, we will push this new user information onto that record
		records.push(attributes);
		//Finally, we use the promise-based version of .writeFile() to write our new records to our this.filename
		//Since this.filename is a .json file, we want to input it in in JSON. Therefore, we use JSON.stringify() to parse our records into JSON
		await fs.promises.writeFile(this.filename, JSON.stringify(records));
	}
}
const test = async () => {
	const repository = new UsersRepository('users.json');
	//To test our create method, we create a username and password. It should show up in the terminal and in our users.json file
	repository.create({ username: 'coolcon@hotmail.com', password: 'cooldaddycon' });
	const users = await repository.getAll();
	console.log(users);
};

test();
