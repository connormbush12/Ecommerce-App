//First, we need to require express
const express = require('express');

//Second, we create an app. This app is the object that contains all of the information about what our web browser can do
const app = express();

//Next, we use app.get() to tell the network what to do when it receives a network request coming from our browser. This is called a route handler
//The first argument in .get() is the route route (like root route)
//The second argument is a callback function that always has the same two arguments: a) req (short for request); and b) res (short for result)
//Req is an object that represents an incoming request from our browser to our web server
//Res is an object that represents the outgoing response from our web server back to our browser
app.get('/', (req, res) => {
    //Now, we send out a greeting. This callback function runs whenever anyone who sends a request to the route route of our application
	res.send('hi there!');
});

//Next, to access this info on the browser, we have to set up a listener that listens for any network traffic on a specific port on our machine
//3000 is the name of the port that we use
//Then, we do a callback function
app.listen(3000, () => {
	console.log('Listening');
});


//To test this, first we check to make sure on the terminal the file is still running (if there is an error with this port, change the 3000 to 3001, or 3002, oe 3003, etc...)

//Now, go to your broswer and type in 'localhost:3000' to access this information on the browser
