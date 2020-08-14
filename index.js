const path = require("path");
const cors = require('cors');
const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),

  //Morgan middleware library to log all requests
  morgan = require('morgan');
const app = express();
app.use(bodyParser.json());
const passport = require('passport');
require('./passport.js');

//require express-validator library
const {
  check,
  validationResult
} = require('express-validator');

//integrate Mongoose into REST API
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
//below commented code is for local database
//mongoose.connect('mongodb://localhost:27017/myFlixDB', {
//  useNewUrlParser: true,
//  useUnifiedTopology: true
//});

//code for online database
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(morgan('common'));
var allowedOrigins = ['http://localhost:1234', '*'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth.js')(app);

app.get('/', (req, res) => {
  res.send('<h1>' + '<b>Welcome to myFlix!<b>' + '</h1>')
})

// Gets the list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Gets the data about a single movie, by title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({
    Title: req.params.title
  })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Gets the genre info by genre title
app.get('/movies/genre/:genre', (req, res) => {
  Movies.findOne({
    'Genre.Name': req.params.genre
  })
    .then((movie) => {
      res.status(201).json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Gets the director data by name
app.get('/movies/director/:name', (req, res) => {
  Movies.findOne({
    "Director.Name": req.params.name
  })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Creates a new user
app.post('/users',
  [
    check('Username', 'Username is required').isLength({
      min: 5
    }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({
      Username: req.body.Username
    }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => {
              res.status(201).json(user)
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// Gets the user
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({
    Username: req.params.Username
  })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Updates the user data
app.put('/users/:Username',
  [
    check('Username', 'Username is required').isLength({
      min: 5
    }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    }, {
      new: true
    }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      });
  });

// Add a movie to user's favorite's list
app.post('/users/:username/movies/favorites/:movieID', (req, res) => {
  Users.findOneAndUpdate({
    Username: req.params.username
  }, {
    $push: {
      FavoriteMovies: req.params.movieID
    }
  }, {
    new: true
  }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// Deletes a movie from user's favorite's list
app.delete('/users/:username/movies/favorites/:movieID', (req, res) => {
  console.log(req.params.movieID)
  Users.findOneAndUpdate({
    Username: req.params.username
  }, {
    $pull: {
      FavoriteMovies: req.params.movieID
    }
  }, {
    new: true
  }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// Deregisters user
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({
    Username: req.params.Username
  })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
app.use(express.static('public'));
app.use("/client", express.static(path.join(__dirname, "client", "dist")));
app.get("/client/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
