const fs = require('fs');
const crypto = require('crypto');

//First, we need access to the Utilities library from Node JS
const util = require('util');

//We then want to use .promisify() to turn crypto.scrypt() from a callback function into a promise-based function
const scrypt = util.promisify(crypto.scrypt);

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
		//Within our create() method, we want to hash and salt our password.
		//First, we create a salt by using .randomBytes() and converting it into hex characters
		const salt = crypto.randomBytes(8).toString('hex');
		//Then, we create our buffer (our hexed password) by using scrypt
		//Because we promisified it above, we can use await
		//We pass through the password, the salt, and the key length (not sure why it is 64)
		const buf = await scrypt(attributes.password, salt, 64);
		const records = await this.getAll();
		//Now, we create a new record with our hashed and salted password. First, we spread in attributes. Then, we overwrite password. We use string template literals. First, we include the hexed version of our buffer password. We then divide this string with a period and include the salt in plain text after it. Later on, when we want to check the password, we'll need to split this string on the period to get the salt
		const record = {
			...attributes,
			password: `${buf.toString('hex')}.${salt}`
		};
		//Now, we push in that new record
		records.push(record);
		await this.writeAll(records);
		//And finally return our new account
		return record;
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
