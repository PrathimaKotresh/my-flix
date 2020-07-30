import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

export class MovieView extends React.Component {

  constructor() {
    super();

    this.state = {};
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

  render() {
    const { movie, onBackClick } = this.props;

    if (!movie) return null;

    return (
      <div className="movie-view">
        <img className="movie-poster" width="300px" height="300px" src={movie.ImagePath} />
        <div className="movie-title">
          <span className="label">Title: </span>
          <span className="value">{movie.Title}</span>
        </div>
        <div className="movie-description">
          <span className="label">Description: </span>
          <span className="value">{movie.Description}</span>
        </div>

        <div className="movie-genre">
          <span className="label">Genre: </span>
          <span className="value">{movie.Genre.Name}</span>
        </div>
        <div className="movie-director">
          <span className="label">Director: </span>
          <span className="value">{movie.Director.Name}</span>
        </div>
        <Button variant="primary" type="submit" onClick={() => onBackClick()}>Back</Button>
      </div>


    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string,
    Genre: PropTypes.object,
    Director: PropTypes.object,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired
};