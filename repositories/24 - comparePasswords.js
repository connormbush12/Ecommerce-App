const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

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
		const salt = crypto.randomBytes(8).toString('hex');
		const buf = await scrypt(attributes.password, salt, 64);
		const records = await this.getAll();
		const record = {
			...attributes,
			password: `${buf.toString('hex')}.${salt}`
		};
		records.push(record);
		await this.writeAll(records);
		return record;
	}
	//Now, we want to create a comparePasswords() method to compare our hashed stored password to our inputted password when trying to log in
	//To do this, we want to accept two arguments: the first is 'saved' which is the saved password in our users.json file. This will be in the form of 'hashedPassword.salt'
	//Our second argument is 'supplied', which is the password we just typed in when trying to log in
	async comparePasswords(saved, supplied) {
		//First, we destructure out the hashed password and the salt by splitting the saved password at the period we created when hashing it
		const [ hashed, salt ] = saved.split('.');
		//Now, we hash the supplied password by using the scrypt() function again. We saved this as a promisified version of the normal crypto.scrypt() function so that we don't have to use a callback and so that we can use async
		const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
		//Finally, we return the boolean of whether or not the hashed password that is saved equals the newly hashed inputted password. If they match, this will return true. If not, false.
		//The scrypt function returns a buffer, so we have to hex it to make it comparable
		return hashed === hashedSuppliedBuf.toString('hex');
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
