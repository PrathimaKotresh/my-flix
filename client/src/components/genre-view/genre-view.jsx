import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';
import './genre-view.scss';

/**
* Movie Genre information view
* @function GenreView
* @param {string} props - genreName props
* @returns {GenreView}
*/
export function GenreView(props) {
  const [genre, setGenre] = useState(null);

  useEffect(() => {
    axios.get('http://myflix-movieapp.herokuapp.com/movies/genre/' + props.genreName)
      .then(response => {
        setGenre(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  if (!genre) return null

  return (
    <div className="genreContent">
      <Badge variant="primary">Genre</Badge>{' - ' + genre.Name}
      <br />
      <Badge variant="primary">Description</Badge>{' - ' + genre.Description}
    </div>
  );
}

GenreView.propTypes = {
  genreName: PropTypes.string.isRequired
};