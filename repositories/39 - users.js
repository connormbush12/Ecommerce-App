const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
//We can reuse most of the code we had in the UserRepository for our ProductRepository, so we refactor that out into its own base class called Repository.
//First, we require that repository in here.
const Repository = require('./repository')

const scrypt = util.promisify(crypto.scrypt);

//Then, we use the extends keyword to extend that class. This means that UserRepository gets access to all of the methods on the Repository class plus any that are added here.
class UsersRepository extends Repository{
    //The two methods that are specific to UsersRepository that we keep are create() and comparePasswords(). Everything else, we cut and paste into Repository.
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
	async comparePasswords(saved, supplied) {
		const [ hashed, salt ] = saved.split('.');
		const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
		return hashed === hashedSuppliedBuf.toString('hex');
	}
}

module.exports = new UsersRepository('users.json');
