import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

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
    <div>
      <div>{genre.Name}</div>
      <div>{genre.Description}</div>
    </div>
  );
}

GenreView.propTypes = {
  genreName: PropTypes.string.isRequired
};