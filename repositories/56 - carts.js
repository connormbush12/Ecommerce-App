//To set up our carts repository, first we require in our repository class
const Repository = require('./repository')

//Then we create our cart repository and extend repository. For now, we just leave the object blank until we determine if we need any unique functionality
class CartRepository extends Repository {}

//Then, we export an instance of the class and put in the file in which we want to save our repository information to.
module.exports = new CartRepository('carts.json')

