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
                         console.log(i + 1, "The venue is " + bandData.data[i].venue.name + ". The venue location is " + bandData.data[i].venue.city + ". The date of the event is " + moment(bandData.data[i].datetime).format("MM/DD/YYYY"));
                     }
                }
             )
            break;
        case "spotify-this-song":
        spotify.search({ type: "track", query: response.search, limit: 5 }, function(err, data) {
            if (err) {
              return console.log("Error occurred: " + err);
            }
           
           console.log(data.tracks.items);
           });
        
            break;
        case "movie-this":
        axios.get("http://www.omdbapi.com/?t=" + response.search + "&y=&plot=short&apikey=" + movie).then(
            function (movieData) {
                console.log("The movie's title is: " + movieData.data.Title);
                console.log("The movie's release year is: " + movieData.data.Year);
                console.log("The movie's IMDB rating is: " + movieData.data.imdbRating);
                console.log("The movie's Rotten Tomatoes rating is: " + movieData.data.Ratings[1].Value);
                console.log("The movie's country of origin is: " + movieData.data.Country);
                console.log("The movie's language is: " + movieData.data.Language);
                console.log("The movie's plot is: " + movieData.data.Plot);
                console.log("The movie's cast is: " + movieData.data.Actors);

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
