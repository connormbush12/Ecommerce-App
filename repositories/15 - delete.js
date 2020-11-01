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
	async getOne(id) {
		const records = await this.getAll();
		return records.find((records) => records.id === id);
	}
	//Now we create out delete method
	async delete(id) {
		//For this, first we need to get all of the records
		const records = await this.getAll();
		//Then, we will create a variable called filteredRecords using the .filter() array callback method. .filter() only copies the elements that return a value of true. We want to copy over all of the records except for the one whose ID we inputted. Therefore, we will make the boolean expression records.id !== id, so it filters out the one ID we are trying to delete
		const filteredRecords = records.filter((records) => records.id !== id);
		//Then, we use writeAll() to write our new filteredRecords onto our this.filename
		await this.writeAll(filteredRecords);
	}
}
const test = async () => {
	const repository = new UsersRepository('users.json');
	//To test it, we just use .delete() with an ID we have in our users.json file, and then we check the users.json file to make sure it deleted
	await repository.delete('e45698cf');
};

test();
