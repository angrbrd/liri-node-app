// Load the Twitter Node.js module
var Twitter = require('twitter');

// Read in the Twitter keys from a file
var keys = require('./keys.js');

// Store the Twitter keys in a variable
var twitterKeys = keys.twitterKeys;

// Read in the command line arguments
var cmdArgs = process.argv;

// The LIRI command will always be the second command line argument
var liriCommand = cmdArgs[2];

// The parameter to the LIRI command may contain spaces
var liriArg = '';
for (var i = 3; i < cmdArgs.length; i++) {
	liriArg += cmdArgs[i] + ' ';
}

// console.log('liriCommand = ' + liriCommand);
// console.log('liriArg = ' + liriArg + '\n');

// Determine which LIRI command is being requested by the user
if (liriCommand === 'my-tweets') {
	// console.log('__my-tweets__');

	// Initialize the Twitter client
	var client = new Twitter(twitterKeys);

	// Set the 'screen_name' to my Twitter handle
	var params = {screen_name: '_angrbrd', count: 20};

	// Retrieve the last 20 tweets
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			console.log('ERROR: Retrieving user tweets -- ' + error);
		} else {
			// Pretty print user tweets
			console.log('------------------------');
			console.log('User Tweets: ');
			console.log('------------------------\n');

			for (var i = 0; i < tweets.length; i++) {
				console.log('Created on: ' + tweets[i].created_at);
				console.log('Tweet content: ' + tweets[i].text);
				console.log('------------------------\n');
			}
		}

	});

} else if (liriCommand === `spotify-this-song`) {
	console.log('__spotify-this-song__');


} else if (liriCommand === `movie-this`) {
	console.log('__movie-this__');


} else if (liriCommand ===  `do-what-it-says`) {
	console.log('__do-what-it-says__');


} else {
	// If the user types in a command that LIRI does not recognize, output the Usage menu 
	// which lists the available commands.
	console.log('Usage:');
	console.log('    node liri.js my-tweets');
	console.log('    node liri.js spotify-this-song "<song_name>"');
	console.log('    node liri.js movie-this "<movie_name>"');
	console.log('    node liri.js do-what-it-says');
}