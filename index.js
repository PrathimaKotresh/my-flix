const express = require('express');
//Morgan middleware library to log all requests
morgan = require('morgan');
const app = express();

//JSON object containing data about your top 10 sci-fi movies
let top10Movies = [{
    title: 'Star Wars: The Empire Strikes Back',
  },
  {
    title: 'Star Trek II: The Wrath of Khan',
  },
  {
    title: '2001: A Space Odyssey',
  },
  {
    title: 'E.T.: The Extra-Terrestrial',
  },
  {
    title: 'Aliens',
  },
  {
    title: 'Blade Runner',
  },
  {
    title: 'Back to the Future',
  },
  {
    title: 'Jurassic Park',
  },
  {
    title: 'Children of Men',
  },
  {
    title: 'District 9',
  },
];

app.use(morgan('common'));

// GET requests
app.get('/movies', (req, res) => {
  res.json(top10Movies);
});

app.get('/', (req, res) => {
  res.send('Welcome to my movie collection!');
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
