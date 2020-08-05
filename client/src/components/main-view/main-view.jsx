import React from 'react';
import axios from 'axios'; //to connect to API
import { BrowserRouter as Router, Route } from "react-router-dom";
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';
import { LoginView } from '../login-view/login-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';
import {
  Navbar,
  Nav,
  NavDropdown
} from 'react-bootstrap';
import './main-view.scss';

export class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: [],
      user: null,
      email: null,
      birthday: null,
      isRegister: null,
      favouriteMovies: [],
      isFavouriteMoviesSelected: false
    };
  }
  // One of the "hooks" available in a React Component
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user'),
        email: localStorage.getItem('email'),
        birthday: localStorage.getItem('birthday'),
        favouriteMovies: JSON.parse(localStorage.getItem('favouriteMovies'))
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

  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username,
      email: authData.user.Email,
      birthday: authData.user.Birthday,
      favouriteMovies: authData.user.FavoriteMovies
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    localStorage.setItem('email', authData.user.Email);
    localStorage.setItem('birthday', authData.user.Birthday);
    localStorage.setItem('favouriteMovies', JSON.stringify(authData.user.FavoriteMovies));
    this.getMovies(authData.token);
  }

  onLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('favouriteMovies');
    this.setState({
      user: null,
    });
  }

  onRegisterClick() {
    this.setState({
      isRegister: true
    });
  }

  onRegister(user, password) {
    axios.post('http://myflix-movieapp.herokuapp.com/login', {
      Username: user,
      Password: password
    })
      .then(response => {
        const data = response.data;
        this.onLoggedIn(data);
        this.setState({
          isRegister: false
        });
        window.open('/', '_self');
      })
      .catch(e => {
        console.log('No such user')
      });
  }

  onDegister() {
    axios.delete('https://myflix-movieapp.herokuapp.com/users/' + this.state.user)
      .then(response => {
        const data = response.data;
        this.onLoggedOut()
        this.state = {
          movies: [],
          user: null,
          isRegister: null
        };
        window.open('/', '_self');
      })
      .catch(e => {
        console.log('Error deregistering')
      });
  }

  onFavouritesClick() {
    this.setState({
      isFavouriteMoviesSelected: true,
    });
  }

  onAddToFavourites(movieId) {
    let accessToken = localStorage.getItem('token');
    if (accessToken) {
      axios.post(`http://myflix-movieapp.herokuapp.com/users/${this.state.user}/movies/favorites/${movieId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
        .then(response => {
          const data = response.data;
          this.setState({
            favouriteMovies: data.FavoriteMovies
          });
          localStorage.setItem('favouriteMovies', JSON.stringify(data.FavoriteMovies));
        })
        .catch(e => {
          console.log('No such user')
        });
    }
  }

  onRemoveFromFavourites(movieId) {
    let accessToken = localStorage.getItem('token');
    if (accessToken) {
      axios.delete(`http://myflix-movieapp.herokuapp.com/users/${this.state.user}/movies/favorites/${movieId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
        .then(response => {
          const data = response.data;
          this.setState({
            favouriteMovies: data.FavoriteMovies
          });
          localStorage.setItem('favouriteMovies', JSON.stringify(data.FavoriteMovies));
        })
        .catch(e => {
          console.log('No such user')
        });
    }
  }

  onProfileUpdate(user, password, email, birthday) {
    let accessToken = localStorage.getItem('token');
    if (accessToken) {
      axios.put(`http://myflix-movieapp.herokuapp.com/users/${this.state.user}`, {
        Username: user,
        Password: password,
        Email: email,
        Birthday: birthday,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(response => {
          const data = response.data;
          console.log(data)
          this.setState({
            user: data.Username,
            email: data.Email,
            birthday: data.Birthday,
            favouriteMovies: data.FavoriteMovies
          });
          localStorage.setItem('user', data.Username);
          localStorage.setItem('email', data.Email);
          localStorage.setItem('birthday', data.Birthday);
          localStorage.setItem('favouriteMovies', JSON.stringify(data.FavoriteMovies));
          window.open('/', '_self');
        })
        .catch(e => {
          console.log('Error updating profile - ', e)
        });
    }
  }

  render() {
    const { movies, user, email, birthday, isRegister, favouriteMovies, isFavouriteMoviesSelected } = this.state;

    // add if condition and check if isRegister is true and return RegisterView component
    if (isRegister) return (
      <RegistrationView onRegister={(user, password) => this.onRegister(user, password)} />
    )

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    return (
      <Router>
        <div className="main-view">
          <Navbar bg="dark" variant="dark" className="header" fixed="top">
            <Navbar.Brand href="/">MyFlix</Navbar.Brand>
            <Nav className="mr-auto" />
            {!user && (<Nav>
              <Nav.Link href="/register">Sign Up</Nav.Link>
              <Nav.Link href="/">Login</Nav.Link>
            </Nav>)}
            {
              user && (
                <React.Fragment>
                  <Nav>
                    <Nav.Link onClick={() => this.onFavouritesClick()}>My Favorites</Nav.Link>
                  </Nav>
                  <NavDropdown title={user}>
                    <NavDropdown.Item href="/profile">Update Profile</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => this.onDegister()}>Deregister</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => this.onLoggedOut()}>LogOut</NavDropdown.Item>
                  </NavDropdown>
                </React.Fragment>
              )
            }
          </Navbar>
          <Route exact path="/" render={() => {
            if (!user) return (
              <div className="main-view" style={{ margin: '20px' }}>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </div>
            );
            return (
              <div className="card-deck justify-content-center">
                {
                  isFavouriteMoviesSelected
                    ? favouriteMovies.map(m => <MovieCard key={m} movie={movies.find(movie => movie._id === m)} removeFromFavourites={(movieId) => this.onRemoveFromFavourites(movieId)} isFavourite={true} />)
                    : movies.map(m => <MovieCard key={m._id} movie={m} removeFromFavourites={(movieId) => this.onRemoveFromFavourites(movieId)} addToFavourites={(movieId) => this.onAddToFavourites(movieId)} isFavourite={favouriteMovies.includes(m._id)} />)
                }
              </div>
            )
          }
          } />
          <Route path="/register" render={() => <RegistrationView onRegister={(user, password) => this.onRegister(user, password)} />} />
          <Route
            path="/movies/:movieId"
            render={
              ({ match }) =>
                movies && <MovieView movie={movies.find(m => m._id === match.params.movieId)} removeFromFavourites={(movieId) => this.onRemoveFromFavourites(movieId)} addToFavourites={(movieId) => this.onAddToFavourites(movieId)} isFavourite={favouriteMovies.includes(match.params.movieId)} />}
          />
          <Route path="/director/:name" render={({ match }) => <DirectorView directorName={match.params.name} />} />
          <Route path="/genre/:name" render={({ match }) => <GenreView genreName={match.params.name} />} />
          <Route path="/profile" render={
            () =>
              user && email && birthday && <ProfileView
                username={user}
                email={email}
                birthday={birthday.split('T')[0]}
                onProfileUpdate={(user, password, email, birthday) => this.onProfileUpdate(user, password, email, birthday)} />} />
        </div>
      </Router>
    );
  }
}
