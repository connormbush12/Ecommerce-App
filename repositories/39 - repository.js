//Our UserRepository and our ProductRepository are going to be using a bunch of the same methods. Therefore, we want to create a base Repository class and then have UserRepository and ProductRepository both extend this class and then write in their own specific functionality

//We require in FileSystem and Crypto because they are used in the methods
const fs = require('fs');
const crypto = require('crypto');

//First, we immediately export our Repository class
modulue.exports = class Repository {
    //Everything within here is just cut and pasted from our UserRepository, except for a few exceptions. The comparePasswords method from UserRepository is specific to users, so we don't include that here and we keep that in the UsersRepository. In addition, we need a create method for Repository. However, the one used in UserRepository is specific to users. Therefore, we will create a new create() method for Repository, and then the UserRepository will override this create() method with its more specific version for users.
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
    //The create method for our general Repository follows the same logic as the create method for our UserRepository; however, we don't need to salt it, so we can take that code out
	async create(attributes) {
		attributes.id = this.randomID();

		const records = await this.getAll();
		records.push(attributes);
		await this.writeAll(records);
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