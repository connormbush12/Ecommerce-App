//First, we need to require File System to use later
const fs = require('fs');

//We create a clas to store all of our user data in
class UsersRepository {
	//The first argument we require for the constructor is the filename of the file that we will be storing our repository in
	constructor(filename) {
		//A file is required. First, then, we must check whether or not they passed a filename through. If they didn't, we need to throw an error
		if (!filename) {
			throw new error('Creating a repository requires a filename');
		}
		//If they did pass a filename through, then we set it equal to this.filename within our class
		this.filename = filename;
		//The second step is checking to see if the filename they passed through exists
		try {
			//fs.accessSync checks to see if a file exists in the directory and if we have permission to access it. We put this in a 'try' block. If the filename entered does exist, this will be true and it will skip over the 'catch' block below
			//the "sync" vesion of this method does not require a callback. Since we are only creating one repository and one data file, it's ok to use this
			fs.accessSync(this.filename);
		} catch (err) {
			//If the filename doesn't exist, then we will create a file with that name
			//fs.writeFileSync writes a file with a specific name. Within the file, we simply create an open array.
			//Similar to above, the "sync" vesion of this method does not require a callback. Since we are only creating one repository and one data file, it's ok to use this
			fs.writeFileSync(this.filename, '[]');
		}
	}
}

//Finally, we check it by creating a new class. If it works and we don't have a users.json file in our repositories folder yet, a users.json file should be created for us
const repository = new UsersRepository('users.json');
