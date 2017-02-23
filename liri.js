/*
*	Load Required Node Modules
*/

var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

/*
*	Load the user Twitter keys
*/

var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;

/*
* 	Read in command line arguments
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

// retrieveTweets will retrieve my last 20 tweets and display them together with the date
function retrieveTweets() {
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
}

// spotifySong will retrieve information on a song from Spotify
function spotifySong(song) {
	// If no song is provided, LIRI defaults to 'The Sign' by Ace Of Base
	var search;
	if (song === '') {
		search = 'The Sign Ace Of Base';
	} else {
		search = song;
	}

	spotify.search({ type: 'track', query: search}, function(error, data) {
	    if (error) {
			console.log('ERROR: Retrieving Spotify track -- ' + error);
			return;
	    } else {
			var songInfo = data.tracks.items[0];
			if (!songInfo) {
				console.log('ERROR: No song info retrieved, please check the spelling of the song name!');
				return;
			} else {
				// Pretty print the song information
				console.log('------------------------');
				console.log('Song Information: ');
				console.log('------------------------\n');

				console.log('Song Name: ' + songInfo.name);
				console.log('Artist: ' + songInfo.artists[0].name);
				console.log('Album: ' + songInfo.album.name);
				console.log('Preview Here: ' + songInfo.preview_url);
			}
	    }
	});
}

// retrieveOMDBInfo will retrieve information on a movie from the OMDB database
function retrieveOBDBInfo(movie) {
	// If no movie is provided, LIRI defaults to 'Mr. Nobody'
	var search;
	if (movie === '') {
		search = 'Mr. Nobody';
	} else {
		search = movie;
	}

	// Replace spaces with '+' for the query string
	search = search.split(' ').join('+');

	// Construct the query string
	var queryStr = 'http://www.omdbapi.com/?t=' + search + '&plot=full&tomatoes=true';

	// Send the request to OMDB
	request(queryStr, function (error, response, body) {
		if ( error || (response.statusCode !== 200) ) {
			console.log('ERROR: Retrieving OMDB entry -- ' + error);
			return;
		} else {
			var data = JSON.parse(body);
			if (!data.Title && !data.Released && !data.imdbRating) {
				console.log('ERROR: No movie info retrieved, please check the spelling of the movie name!');
				return;
			} else {
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
		}
	});
}

// doAsYerTold will read in a file to determine the desired command and then execute
function doAsYerTold() {
	// Read in the file containing the command
	fs.readFile('./random.txt', 'utf8', function (error, data) {
		if (error) {
			console.log('ERROR: Reading random.txt -- ' + error);
			return;
		} else {
			// Split out the command name and the parameter name
			var cmdString = data.split(',');
			var command = cmdString[0].trim();
			var param = cmdString[1].trim();

			switch(command) {
				case 'my-tweets':
					retrieveTweets(); 
					break;

				case 'spotify-this-song':
					spotifySong(param);
					break;

				case 'movie-this':
					retrieveOBDBInfo(param);
					break;
			}
		}
	});
}

// Determine which LIRI command is being requested by the user
if (liriCommand === 'my-tweets') {
	retrieveTweets(); 

} else if (liriCommand === `spotify-this-song`) {
	spotifySong(liriArg);

} else if (liriCommand === `movie-this`) {
	retrieveOBDBInfo(liriArg);

} else if (liriCommand ===  `do-what-it-says`) {
	doAsYerTold();

} else {
	// If the user types in a command that LIRI does not recognize, output the Usage menu 
	// which lists the available commands.
	console.log('Usage:');
	console.log('    node liri.js my-tweets');
	console.log('    node liri.js spotify-this-song "<song_name>"');
	console.log('    node liri.js movie-this "<movie_name>"');
	console.log('    node liri.js do-what-it-says');
}
