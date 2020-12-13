import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import './movie-view.scss';

/**
* Movie information view with genre, direction links and delete movie from favourite link
* @class MovieView
* @param {string} props - movie, addToFavourites, isFavourite, removeFromFavourites props
* @returns {MovieView}
*/
export class MovieView extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movie, addToFavourites, isFavourite, removeFromFavourites } = this.props;
    const buttonText = isFavourite ? 'Remove from Favorites' : 'Add to Favorites'
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
          <Link to={`/genre/` + movie.Genre.Name}>
            <span className="value">{movie.Genre.Name}</span>
          </Link>
        </div>
        <div className="movie-director">
          <span className="label">Director: </span>
          <Link to={`/director/` + movie.Director.Name}>
            <span className="value">{movie.Director.Name}</span>
          </Link>
        </div>
        <Button variant="link" onClick={() => isFavourite ? removeFromFavourites(movie._id) : addToFavourites(movie._id)}>{buttonText}</Button>
        <Link to={`/`}>
          <Button variant="link">Back</Button>
        </Link>
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
  addToFavourites: PropTypes.func,
  isFavourite: PropTypes.bool.isRequired,
  removeFromFavourites: PropTypes.func,
};