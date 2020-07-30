import React from 'react';
import axios from 'axios'; //to connect to API
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';
import { LoginView } from '../login-view/login-view';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';


export class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: null,
      selectedMovie: null,
      user: null,
      isRegister: null
    };
  }
  // One of the "hooks" available in a React Component
  componentDidMount() {
    axios.get('https://myflix-movieapp.herokuapp.com/movies')
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onBackClick() {
    this.setState({
      selectedMovie: null
    });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  onRegisterClick() {
    this.setState({
      isRegister: true
    });
  }

  onRegister(user) {
    this.setState({
      user: user,
      isRegister: false
    });
  }

  render() {
    const { movies, selectedMovie, user, isRegister } = this.state;

    // add if condition and check if isRegister is true and return RegisterView component
    if (isRegister) return (
      <RegistrationView onRegister={user => this.onRegister(user)} />
    )

    if (!user) return (
      <div className="main-view" style={{ margin: '20px' }}>
        <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
        <label>Not yet a member?</label>
        <Button variant="primary" type="button" onClick={() => this.onRegisterClick()}>Register</Button>
      </div>
    );

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;
    return (
      <div className="main-view">
        {selectedMovie
          ? <MovieView movie={selectedMovie} onBackClick={() => this.onBackClick()} />
          : (
            <div className="card-deck justify-content-center">
              {
                movies.map(movie => (
                  <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
                ))
              }
            </div>
          )
        }
      </div>
    );
  }
}
