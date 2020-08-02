import React from 'react';
import axios from 'axios'; //to connect to API
import { BrowserRouter as Router, Route } from "react-router-dom";
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';
import { LoginView } from '../login-view/login-view';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

export class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: [],
      selectedMovie: null,
      user: null,
      isRegister: null
    };
  }
  // One of the "hooks" available in a React Component
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  getMovies(token) {
    axios.get('https://myflix-movieapp.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
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

  onLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({
      user: null,
    });
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

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;
    return (
      <Router>
        <div className="main-view">
          <Route exact path="/" render={() => {
            if (!user) return (
              <div className="main-view" style={{ margin: '20px' }}>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                <label>Not yet a member?</label>
                <Link to={`/register`}>
                  <Button variant="link"> Register</Button>
                </Link>
              </div>
            );
            return (
              <div className="card-deck justify-content-center">
                {
                  movies.map(m => <MovieCard key={m._id} movie={m} />)
                }
              </div>
            )
          }
          } />
          <Route path="/register" render={() => <RegistrationView />} />
          <Route
            path="/movies/:movieId"
            render={
              ({ match }) =>
                <MovieView movie={movies.find(m => m._id === match.params.movieId)} />}
          />
        </div>
      </Router>
    );
  }
}
