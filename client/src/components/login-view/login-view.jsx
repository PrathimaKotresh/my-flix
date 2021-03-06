import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';
import axios from 'axios';
import './login-view.scss';

/**
* Login view
* @function LoginView
* @param {func} props - onLoggedIn props
* @returns {LoginView}
*/
export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  /**
   * username/password input request sent to /login post endpoint 
   * @function handleSubmit
   * @param {event}
   * @return {object} User information
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    /* Send a request to the server for authentication */
    axios.post('http://myflix-movieapp.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log('No such user')
      });
  };

  return (
    <Form className="loginForm">
      <Form.Row className="align-items-center">
        <Col xs sm={6} className="loginFormContent">
          <Form.Group>
            <Form.Label>Username:</Form.Label>
            <Form.Control type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Login
          </Button>
          <br />
          <label>Not yet a member?</label>
          <Link to={`/register`}>
            <Button variant="link"> Sign Up</Button>
          </Link>
        </Col>
      </Form.Row>
    </Form>
  );
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired
};