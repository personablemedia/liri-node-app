// require('dotenv').config();
var apiKeys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

// Twitter
var myTweets = function(newTweet) {
  var client = new Twitter(apiKeys.twitter);
  var params = { screen_name: "HeathRost", count: 20 };

  if (newTweet) {
    // do this if user provides new tweet
    console.log("Tweet this " + newTweet);
  } else {
    // else print out 20 latest tweets
    client.get("statuses/user_timeline", params, function(
      error,
      tweets,
      response
    ) {
      if (!error) {
        var tweetCount = tweets.length >= 20 ? 20 : tweets.length;
        // console.log(tweets);
        //
        for (var i = 0; i < tweetCount; i++) {
          console.log(tweets[i].text);
          console.log("------------------------------------------------");
          // console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+");
        }
      }
    });
  }
};


// Spotify
var mySong = function(songRequest) {
  spotify = new Spotify({
    id: "",
    secret: ""
  });
  // Default if no song is entered
  if (!songRequest) {
    songRequest = "That's What I Like";
  }
  spotify.search({ type: "track", query: songRequest }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    console.log(data.tracks.items[0].album.artists[0]);
    // Artist

    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("------------------------------------------------");
    // Song Name

    console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name);
    console.log("------------------------------------------------");
    // Artist Name

    console.log("Preview Link: " + data.tracks.items[0].preview_url);
    console.log("------------------------------------------------");
    // Preview Link

    console.log("Album Name: " + data.tracks.items[0].album.name);
    console.log("------------------------------------------------");
    // Album Name
  });
};

// IMBD
var myMovie = function(selectMovie) {
  if (!selectMovie) {
    selectMovie = "Rounders";
  }
  request("http://www.omdbapi.com/?t=" + selectMovie + "&y=&plot=short&apikey=trilogy",
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log("Title of movie: " + JSON.parse(body).Title);
        console.log("-------------------------------------------------------");
        console.log("Year movie came out: " + JSON.parse(body).Year);
        console.log("-------------------------------------------------------");
        console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
        console.log("-------------------------------------------------------");
        console.log("Country: " + JSON.parse(body).Country);
        console.log("-------------------------------------------------------");
        console.log("Language: " + JSON.parse(body).Language);
        console.log("-------------------------------------------------------");
        console.log("Plot of movie: " + JSON.parse(body).Plot);
        console.log("-------------------------------------------------------");
        console.log(
          "Actors & actresses: " +
            JSON.parse(body).Actors
        );
        console.log("-------------------------------------------------------");

        //Rotten Tomatoes Rating
        if (!JSON.parse(body).Ratings[1]) {
          console.log("Error: There is no Rotten Tomatoe Ratings");
          console.log(
            "-------------------------------------------------------"
          );
        } else {
          console.log(
            "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
          );
          console.log(
            "-------------------------------------------------------"
          );
        }
      }
    }
  );
};

// Request
var myRequest = function(hola) {
  fs.readFile("./../../random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    var dataArr = data.split(",");
    liriMagic(dataArr[0], dataArr[1]);
  });
};

var liriMagic = function(mediaType, content) {

  switch (mediaType) {

    case "my-tweets":
      myTweets(content);
      break;

    case "spotify-this-song":
      mySong(content);
      break;

    case "movie-this":
      myMovie(content);
      break;

    case "do-what-it-says":
      myRequest(content);
      break;

    default:
      console.log("Console.log switch case works for default");
      break;
  }

  // Main Process
  liriMagic(process.argv[2], process.argv[3]);

  // Log all commands to the log.txt file
  // var newCommand = process.argv[2];
  //
  // fs.appendFile("./../../log.txt", newCommand, function(err) {
  //     if (err) {
  //       console.log(err);
  //     }
  //     if (process.argv[3]) {
  //       newCommand = newCommand + ",'" + process.argv[3] + "',";
  //     }
  //   });
  // };
