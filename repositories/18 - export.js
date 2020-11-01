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
	async update(id, attributes) {
		const records = await this.getAll();
		const record = records.find((records) => records.id === id);

		if (!record) {
			throw new Error(`Record with ID: ${id} not found`);
		}
		Object.assign(record, attributes);
		await this.writeAll(records);
	}
	async getOneBy(filters) {
		const records = await this.getAll();
		for (let record of records) {
			let found = true;
			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}
			if (found) {
				return record;
			}
		}
	}
}

//Finally, we want to export this information so that whenever we require users.js, we get access to the information here
//We could export UsersRepository directly; however, any time we want to use it, we would have to remember to create a new UsersRepository with a file to save it to.
//Instead, we export an instance of UsersRepository by exporting new UsersRepository('users.json'). Now, whenever another file requires it, we can go right into using it without having to declare a separate version of it. This cuts down on potential typo errors or other issues that could arrise.
module.exports = new UsersRepository('users.json');
