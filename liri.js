//var Keys = require('./keys.js');
var Twitter = require('twitter');
var spotifyAPI = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

// Input Arguments
var userCommand = process.argv[2];
var userInput = process.argv[3];



// Twitter


// Switch Case to switch between functions based upon user input

switch (userCommand) {
        case 'my-tweets':

        twitterKey = {
          consumer_key: "nJlMTpdoWr7k5Rh4tDEeA",
          consumer_secret: "PuGnUq88YwwdHnqlAL0uwEp6YAEoT8zf3kAngUX8",
          access_token_key: "67731721-29lLPHKD3NNGy9pO42eOGY0GCdW5miplZpEM3XDdg",
          access_token_secret: "jHVYgVyJ4rbOy0CeMiZF1RS02DWF2wGLSK68RmALY"
        };
        var client = new Twitter(twitterKey);
        var myTweets = function () {
          var params = { screen_name: "HeathRost", count: 1 };
          client.get("statuses/user_timeline", params, function (err, tweets, response) {
            if (err) {
              console.log(err);
              return;
            }

            var tweetCount = tweets.length >= 20 ? 20 : tweets.length;
            for (var i = 0; i < tweetCount; i++) {
              console.log(tweets[i].text);
              console.log("------------------------------------------------");
            }
          });
        };

        break;

        case 'spotify-this-song':
            var songName = userInput;
            spotifyThis(songName);
        break;

        case 'movie-this':
            movieName = userInput;
            movieThis(movieName);
        break;

        case 'do-what-it-says':
            doIt();
        break;

        default:
            console.log("Enter an approved command")
};


// spotifyThis
function spotifyThis(songName) {
    // Authenticate the connection to Spotify API
    var spotify = new spotifyAPI ({
      id: "046ab0c44b7f474f91b34ce64d575f4b",
      secret: "f7ded69da4514be896e1cb53b128790d"
    });
    // If the user leaves the song name input blank, we'll spam them
    if (songName == null) {
        songName = 'The Sign Ace of Base3';
    }
    // Have a separate parameters variable for the songName for a null case
    var parameters = songName;
    // Create the search of the spotify and input parameters
    spotify.search({ type: 'track', query: parameters }, function(error, data) {
        if (!error && songName != null) {
          for (var i = 0; i < data.tracks.items.length; i++) {
            var artists = data.tracks.items[i].artists[0].name; //This took forever to find in the API documentation
            var name = data.tracks.items[i].name;
            var preview = data.tracks.items[i].preview_url;
            var album = data.tracks.items[i].album.name;
            console.log('=================================');
            console.log('Artists: ' + artists);
            console.log('Song Name: '+ name);
            console.log('Preview URL: '+ preview);
            console.log('Album Name: '+ album);
            console.log('=================================');
          }
        } else {
            console.log("Error: "+ error);
         }
    })
}


// movieThis
function movieThis(movieName) {
    // If the user leaves the entry blank, we give them Mr. Nobody
    if (movieName == null) {
        movieName = 'Mr. Nobody';
    }
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
      if (!error && response.statusCode === 200) {
          console.log('===========================================');
          console.log("Title: " + JSON.parse(body).Title);
          console.log("The move came out in " + JSON.parse(body).Year);
          console.log("The movie's IMDB rating is: " + JSON.parse(body).imdbRating);
          console.log("The movie's Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
          console.log("County the movie was produced in: " + JSON.parse(body).Country);
          console.log("Movie Language: " + JSON.parse(body).Language);
          console.log("Plot Synopsis: " + JSON.parse(body).Plot);
          console.log("Actors: " + JSON.parse(body).Actors);
          console.log('===========================================');
      } else {
          console.log("Error: "+ error);
      }
    });
}

// Do IT
function doIt() {
    // Read the file useing the fs package
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log("Error: "+ error);
        } else {
            var stuffToDo = data.split(","); // Split the entries into an array
            userCommand = stuffToDo[0]; // Turn the first entry into the command
            userInput = stuffToDo[1]; // Turn the second entry into the input
            // Runs Switch case.  Is there a way to do this without writing it out again?
            switch (userCommand) {
            case 'my-tweets':
                myTweets();
            break;

            case 'spotify-this-song':
                var songName = userInput;
                spotifyThis(songName);
            break;

            case 'movie-this':
                movieName = userInput;
                movieThis(movieName);
            break;

            case 'do-what-it-says':
            doIt();
            break;

            default:
                console.log("Enter an approved command")
            }
        }
    })
}
