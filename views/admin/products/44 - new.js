const layout = require('../layout')
const {getError} = require('../../helpers')

module.exports = ({errors}) => {
    return layout({
        //Now, we have to include the getError function and print our errors if we pass them through
        content: `
        <form method="POST" enctype="multipart/form-data">
            <input placeholder="Title" name="title" />
            ${getError(errors, 'title')}
            <input placeholder="Price" name="price" />
            ${getError(errors, 'price')}
            <input type="file" name="image" />
            <button>Submit</button>
        </form>
        `
    })
};