const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  //Morgan middleware library to log all requests
  morgan = require('morgan');
const app = express();
app.use(bodyParser.json());

//JSON object containing data about your top 10 sci-fi movies
let movies = [{
    title: "Captain Marvel",
    description: "Carol Danvers becomes one of the universe's most powerful heroes when Earth is caught in the middle of a galactic war between two alien races.",
    genre: "Action, Adventure, Sci-Fi",
    director: "Anna Boden",
    imagePath: "",
    Featured: true
  },
  {
    title: "Avengers: Endgame ",
    description: "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    genre: "Action, Adventure, Sci-Fi",
    director: "Anthony Russo",
    imagePath: "",
    Featured: true
  },
  {
    title: "The Perfection",
    description: "When troubled musical prodigy Charlotte seeks out Elizabeth, the new star pupil of her former school, the encounter sends both musicians down a sinister path with shocking consequences.",
    genre: "Drama, Horror, Thriller",
    director: "Richard Shepard",
    imagePath: "",
    Featured: true
  }
];

app.use(morgan('common'));

// Gets the list of all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Gets the data about a single movie, by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.title === req.params.title;
  }));
});

// Gets the genre of a single movie, by title
app.get('/movies/:title/genre', (req, res) => {
  const allowed = ['title', 'genre'];
  const movie = movies.find((movie) => {
    return movie.title === req.params.title;
  })
  const filteredMovieObject = Object.keys(movie)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = movie[key];
      return obj;
    }, {});
  res.json(filteredMovieObject);
});

// Gets the director data by name
app.get('/movies/director/:name', (req, res) => {
  res.send('Successfully returned director data');
});

// Creates a new user
app.post('/users', (req, res) => {
  res.send('Successfully registers new user');
});

// Updates the user data
app.put('/users/:username', (req, res) => {
  res.send('Successfully updated user data');
});

// Add a movie to user's favorite's list
app.post('/users/:username/movies/favorites/:title', (req, res) => {
  res.send('Successfully added movie to favorite list');
});

// Deletes a movie from user's favorite's list
app.delete('/users/:username/movies/favorites/:title', (req, res) => {
  res.send('Successfully removed movie to favorite list');
});

// Deregisters user
app.delete('/users/:username', (req, res) => {
  res.send('User is successfully deregisterd');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

app.use(express.static('public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
