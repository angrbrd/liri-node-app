// Read in the Twitter keys from a file
var keys = require('./keys.js');

// Store the Twitter keys in a variable
var twitterKeys = keys.twitterKeys;

// Read in the command line arguments
var liriCommand = process.argv[2];
var liriArg = process.argv[3];

console.log("liriCommand = " + liriCommand);
console.log("liriArg = " + liriArg + '\n');

// Determine which Liri command is being requested by the user
if (liriCommand === 'my-tweets') {
	console.log('__my-tweets__');


} else if (liriCommand === `spotify-this-song`) {
	console.log('__spotify-this-song__');


} else if (liriCommand === `movie-this`) {
	console.log('__movie-this__');


} else if (liriCommand ===  `do-what-it-says`) {
	console.log('__do-what-it-says__');


} else {
	// If the user types in a command that Liri does not recognize, output the Usage menu 
	// which lists the available commands.
	console.log('Usage:');
	console.log('    node liri.js my-tweets');
	console.log('    node liri.js spotify-this-song "<song_name>"');
	console.log('    node liri.js movie-this "<movie_name>"');
	console.log('    node liri.js do-what-it-says');
}