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
		//To access this attributes to assign our userID to our cookie, we have to return the attributes so that we can save it to a variable.
		return attributes;
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

module.exports = new UsersRepository('users.json');
