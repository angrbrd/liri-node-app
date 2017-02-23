/*
*	Load Required Node Modules
*/

var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

/*
*	Load the user Twitter keys
*/

var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;

/*
* 	Read in command line arguments and execute the command
*/

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
			return;
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
	// console.log('__spotify-this-song__');

	// If no song is provided, LIRI defaults to 'The Sign' by Ace Of Base
	var search;
	if (liriArg === '') {
		search = 'The Sign Ace Of Base';
	} else {
		search = liriArg;
	}

	spotify.search({ type: 'track', query: search}, function(error, data) {
	    if (error) {
			console.log('ERROR: Retrieving Spotify track -- ' + error);
			return;
	    } else {
	    	// Pretty print the song information
			console.log('------------------------');
			console.log('Song Information: ');
			console.log('------------------------\n');

			var songInfo = data.tracks.items[0];

			console.log('Song Name: ' + songInfo.name);
			console.log('Artist: ' + songInfo.artists[0].name);
			console.log('Album: ' + songInfo.album.name);
			console.log('Preview Here: ' + songInfo.preview_url);
	    }
	});

} else if (liriCommand === `movie-this`) {
	// console.log('__movie-this__');

	// If no movie is provided, LIRI defaults to 'Mr. Nobody'
	var search;
	if (liriArg === '') {
		search = 'Mr. Nobody';
	} else {
		search = liriArg;
	}

	// Replace spaces with '+' for the query string
	search = search.split(' ').join('+');

	// Construct the query string
	var queryStr = 'http://www.omdbapi.com/?t=' + search + '&plot=full&tomatoes=true';
	//console.log('queryStr = ' + queryStr);

	// Send the request to OMDB
	request(queryStr, function (error, response, body) {
		if ( error || (response.statusCode !== 200) ) {
			console.log('ERROR: Retrieving OMDB entry -- ' + error);
			return;
		} else {
			var data = JSON.parse(body);

	    	// Pretty print the movie information
			console.log('------------------------');
			console.log('Movie Information: ');
			console.log('------------------------\n');

			console.log('Movie Title: ' + data.Title);
			console.log('Year Released: ' + data.Released);
			console.log('IMBD Rating: ' + data.imdbRating);
			console.log('Country Produced: ' + data.Country);
			console.log('Language: ' + data.Language);
			console.log('Plot: ' + data.Plot);
			console.log('Actors: ' + data.Actors);
			console.log('Rotten Tomatoes Rating: ' + data.tomatoRating);
			console.log('Rotten Tomatoes URL: ' + data.tomatoURL);
		}
	});

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
