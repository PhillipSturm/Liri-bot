require("dotenv").config();

debugger;
var Spotify = require("node-spotify-api");
var moment = require("moment");
var axios = require("axios");

var keys = require("./keys");

var spotify = new Spotify(keys.spotify); 
var inquirer = require("inquirer");

var band = process.env.BANDS_API_KEY;
var movie = process.env.OMDB_API_KEY;

inquirer
    .prompt([
    {
        type: "list",
        message: "Select a catagory",
        choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "userChoice"
        },
        {
            type: "input",
            name: "search",
            message: "What do you want to search for?"
        }
    ]).then(function (response) {
      
     switch (response.userChoice) {
         case "concert-this":
             axios.get("https://rest.bandsintown.com/artists/" + response.search + "/events?app_id=" + band).then(
                 function (bandData) {
                     //  console.log(bandData.data[0].venue.name);
                     //  console.log(bandData.data[1].venue);
                     for (var i = 0; i < bandData.data.length; i++) {
                         
                         //  console.log(i, bandData.data[i].venue);
                         console.log(i + 1, "The venue is " + bandData.data[i].venue.name +
                             ". The venue location is " + bandData.data[i].venue.city +
                             ". The date of the event is " +
                             moment(bandData.data[i].datetime).format("MM/DD/YYYY"));
                     }
                }
             )
            break;
         case "spotify-this-song":
         if (!response.search){response.search = "The Sign Ace of Base";}
             spotify.search({ type: 'track', query: response.search }, function (err, data) {
                var songSearch = data.tracks.items;
             if (err){
                 console.log('Error occurred: ' + err);
                 return;
             }
         console.log(
                     "\nArtist(s): " + songSearch[0].artists[0].name +
                     "\n. Song Name: " + songSearch[0].name +
                     "\n. External Link: " + songSearch[0].external_urls.spotify +
                     "\n. Album: " + songSearch[0].album.name);
                 
             // Was having issues with the preview link not showing up with some songs, so I put in the external link to the song instead //
     });
            break;
         case "movie-this":
         if (!response.search){response.search = "Mr. Nobody";}
             axios.get("http://www.omdbapi.com/?t=" + response.search + "&y=&plot=short&apikey=" + movie).then(
                 function (movieData) {
                    var mvData = movieData.data;
                console.log("The movie's title is: " + mvData.Title);
                console.log("The movie's release year is: " + mvData.Year);
                console.log("The movie's IMDB rating is: " + mvData.imdbRating);
                console.log("The movie's Rotten Tomatoes rating is: " + mvData.Ratings[1].Value);
                console.log("The movie's country of origin is: " + mvData.Country);
                console.log("The movie's language is: " + mvData.Language);
                console.log("The movie's plot is: " + mvData.Plot);
                console.log("The movie's cast is: " + mvData.Actors);
            }
          )
            break;
        case "do-what-it-says":
            console.log("whatever")
            break;

        default:
            console.log("Please enter something");
        
            break;
    }
});
