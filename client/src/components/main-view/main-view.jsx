import React from 'react';
import axios from 'axios'; //to connect to API
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from "react-router-dom";
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
import { setMovies, setUser } from '../../actions/actions';
import MoviesList from '../movies-list/movies-list';

export class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      user: null,
      isRegister: null,
      isFavouriteMoviesSelected: false
    };
  }
  // One of the "hooks" available in a React Component
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user'),
      });
      this.getUserData(accessToken);
      this.getMovies(accessToken);
    }
  }

  getMovies(token) {
    axios.get('https://myflix-movieapp.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getUserData(token) {
    axios.get('https://myflix-movieapp.herokuapp.com/user/' + this.state.user, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setUser(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username,
    });
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.props.setUser(authData.user);
    this.getMovies(authData.token);
  }

  onLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({
      user: null,
    });
    this.props.setUser(null);
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
          user: null,
        };
        this.props.setMovies([]);
        this.props.setUser(null);
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
          const data = response.data
          this.props.setUser(data);
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
          const { userData } = this.props
          userData.FavoriteMovies = data.FavoriteMovies
          this.props.setUser(userData);
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
          const data = response.data
          this.props.setUser(data);
          this.setState({
            user: data.Username,
          });
          localStorage.setItem('user', data.Username);
          window.open('/', '_self');
        })
        .catch(e => {
          console.log('Error updating profile - ', e)
        });
    }
  }

  render() {
    const { movies, userData, visibilityFilter } = this.props;
    const { user, isRegister, isFavouriteMoviesSelected } = this.state;
    const filteredFavoriteMovies = [...new Set(userData.FavoriteMovies)]
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
                    <Nav.Link href="/">Home</Nav.Link>
                  </Nav>
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
              <div>
                {
                  isFavouriteMoviesSelected
                    ? <MoviesList
                      moviesToShow={filteredFavoriteMovies}
                      allMovies={movies}
                      favouriteMovies={filteredFavoriteMovies}
                      removeFromFavourites={(movieId) => this.onRemoveFromFavourites(movieId)}
                      isFavourites={true}
                      visibilityFilter={visibilityFilter}
                    />
                    : <MoviesList
                      moviesToShow={movies}
                      allMovies={movies}
                      favouriteMovies={filteredFavoriteMovies}
                      removeFromFavourites={(movieId) => this.onRemoveFromFavourites(movieId)}
                      addToFavourites={(movieId) => this.onAddToFavourites(movieId)}
                      isFavourites={false}
                      visibilityFilter={visibilityFilter}
                    />
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
                movies && <MovieView movie={movies.find(m => m._id === match.params.movieId)} removeFromFavourites={(movieId) => this.onRemoveFromFavourites(movieId)} addToFavourites={(movieId) => this.onAddToFavourites(movieId)} isFavourite={favouriteMovies && favouriteMovies.includes(match.params.movieId)} />}
          />
          <Route path="/director/:name" render={({ match }) => <DirectorView directorName={match.params.name} />} />
          <Route path="/genre/:name" render={({ match }) => <GenreView genreName={match.params.name} />} />
          <Route path="/profile" render={
            () =>
              user && userData.Email && userData.Birthday && <ProfileView
                username={user}
                email={userData.Email}
                birthday={userData.Birthday.split('T')[0]}
                onProfileUpdate={(user, password, email, birthday) => this.onProfileUpdate(user, password, email, birthday)} />} />
        </div>
      </Router>
    );
  }
}

MainView.propTypes = {
  movies: PropTypes.array,
  userData: PropTypes.shape({
    Username: PropTypes.string,
    Email: PropTypes.string,
    Birthday: PropTypes.string,
    FavoriteMovies: PropTypes.array,
  }),
  visibilityFilter: PropTypes.string
};

let mapStateToProps = state => {
  return {
    movies: state.movies,
    userData: state.user,
    visibilityFilter: state.visibilityFilter,
  }
}

export default connect(mapStateToProps, { setMovies, setUser })(MainView);
