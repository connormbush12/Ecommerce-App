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
	async create(attributes) {
		const records = await this.getAll();
		records.push(attributes);
		//Instead of typing out this code to write a file for each method that needs it, we create one method named writeAll that we pass through our records too
		await this.writeAll(records);
	}
	async writeAll(records) {
		//We simply copy and paste this line of code from .getAll() to writeAll
		//We can add two more arguments to JSON.stringify() to make our JSON file easier to read.
		//The second argument is a 'replacer' argument that allows us to pass through a function that alters the stringification process. For this, we pass through 'null' since we don't want to do anything to that
		//The third argument is the 'space' argument that allows us to pass through white space between entries for readability purposes. We pass through the number '2' so that it includes 2 white spaces
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}
}
const test = async () => {
	const repository = new UsersRepository('users.json');
	repository.create({ username: 'coolcon@hotmail.com', password: 'cooldaddycon' });
	const users = await repository.getAll();
	console.log(users);
};

test();
