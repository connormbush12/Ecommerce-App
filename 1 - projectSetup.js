console.log('bye there!');

//First, we create a directory by using the 'mkdir' command in the terminal
//Second, we create a package.json file by typing in 'npm init -y'
//Third, we install express and nodemon with 'npm install express nodemon'
//Fourth, we open up our project with 'code .'
//Fifth, we create an index.js file with a basic console.log of 'hi there'
//Sixth, we go into our package.json file. Within the "scripts" property, we delete the "test" tag. We replace it with a "dev" property. As the value, we set it as "nodemon index.js". This now makes this file executable from the terminal. In addition, nodemon is a library that reruns our file whenever anything in the directory changes (similar to our watchit app we made)
//Finally, we run the file in our terminal using 'npm run dev'
