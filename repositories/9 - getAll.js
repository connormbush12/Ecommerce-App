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
	//Within the class, we create our first method: getAll()
	//The getAll method will be used to get all of the user account data from our repository
	//We need to make this async so we can take advantage of the File System promise-based methods
	async getAll() {
		//The first thing we want to do is open the file called this.filename and save it to a variable
		//We use fs.readFile() for this. We used the promised based version and await the results of this.
		const contents = await fs.promises.readFile(this.filename, { encoding: 'utf8' });

		//The next thing we want to do is read the contents of the file. For now, we will just console.log() this
		console.log(contents);

		//Parse the contents

		//Returned the parsed data
	}
}
//To test this, we need to use repository.getAll(). However, since the function is async, we need to await it so that we get all of our information back. Therefore, we wrap this in a test function that is async, and then execute it below.
const test = async () => {
	const repository = new UsersRepository('users.json');
	await repository.getAll();
};

test();
