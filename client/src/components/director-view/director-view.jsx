import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export function DirectorView(props) {
  const [director, setDirector] = useState(null);

  useEffect(() => {
    axios.get('http://myflix-movieapp.herokuapp.com/movies/director/' + props.directorName)
      .then(response => {
        setDirector(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  if (!director) return null

  return (
    <div>
      <div>{director.Name}</div>
      <div>{director.Bio}</div>
      <div>{director.Birth}</div>
    </div>
  );
}

DirectorView.propTypes = {
  directorName: PropTypes.string.isRequired
};