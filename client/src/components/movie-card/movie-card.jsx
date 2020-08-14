import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";

export class MovieCard extends React.Component {
  render() {
    const { movie, addToFavourites, isFavourite, removeFromFavourites } = this.props;
    const buttonText = isFavourite ? 'Remove from Favorites' : 'Add to Favorites'
    return (
      <Card style={{ minWidth: '20rem', maxWidth: '20rem', marginBottom: '20px' }}>
        <Card.Img variant="top" src={movie.ImagePath} style={{ height: '300px' }} />
        <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text>{movie.Description}</Card.Text>
          <Link to={`/movies/${movie._id}`}>
            <Button variant="link">Open</Button>
          </Link>
          <Button variant="link" onClick={() => isFavourite ? removeFromFavourites(movie._id) : addToFavourites(movie._id)}>{buttonText}</Button>
        </Card.Body>
      </Card>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired
  }).isRequired,
  addToFavourites: PropTypes.func,
  isFavourite: PropTypes.bool.isRequired,
  removeFromFavourites: PropTypes.func,
};