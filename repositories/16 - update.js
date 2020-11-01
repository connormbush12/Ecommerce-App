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
	async delete(id) {
		const records = await this.getAll();
		const filteredRecords = records.filter((records) => records.id !== id);
		await this.writeAll(filteredRecords);
	}
	//Now, we create our update method by passing in the ID of the account we want to update and the attributes we want to add
	async update(id, attributes) {
		//First, we get all of our records
		const records = await this.getAll();
		//Then, we need to get the one record who's ID matches ours. We could use getOne() here, but we still need a records variable to eventually write the new file over, so we would need the above line of code regardless
		const record = records.find((records) => records.id === id);

		//We want to throw an error if the record we searched for with the ID doesn't exist.
		if (!record) {
			throw new Error(`Record with ID: ${id} not found`);
		}
		//Now, we use Object.assign() to add the attributes to our record object
		Object.assign(record, attributes);
		//Finally, we overwrite our records with this new record.
		await this.writeAll(records);
	}
}
const test = async () => {
	const repository = new UsersRepository('users.json');
	//To test it, we pull an ID from our users.json file and test it out
	await repository.update('3101eac5', { email: 'coolcon@gmail1234.com', password: 'coolcondaddy' });
};

test();
