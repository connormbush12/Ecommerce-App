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
	//Now, we create our getOneBy() method that returns any records that match the filter criteria
	//The filter criteria will be passed through as an argument
	async getOneBy(filters) {
		//First, we get all of the records
		const records = await this.getAll();
		//Then, we loop over records using a for...of loop since records is an array
		for (let record of records) {
			//We define a temperorary variable called found and set it to true
			let found = true;
			//we then do another loop, this time a for...in loop of filters because filters is an object
			for (let key in filters) {
				//We check to see if the value for a given key for this record does not equal the value for a given key for our filters object
				if (record[key] !== filters[key]) {
					//If they don't equal, then we set the found variable to false
					found = false;
				}
			}
			//After if loops over every key in our filters object, if at any point one of the filters wasn't true, the found variable gets set to false. However, if our record mathed all of the filters, then the found variable is still true
			if (found) {
				//If it is true, then we return our record.
				return record;
			}
		}
	}
}
const test = async () => {
	const repository = new UsersRepository('users.json');
	//Test it by creating a user, using .getOneBy with filters, and then console.logging it to see if we get our expected results
	const user = await repository.getOneBy({ email: 'coolcon@gmail1234.com', password: 'coolcondaddy' });
	console.log(user);
};

test();
