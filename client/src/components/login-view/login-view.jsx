import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';
import axios from 'axios';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Send a request to the server for authentication */
    axios.post('YOUR_API_URL/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log('no such user')
      });
  };

  return (
    <Form>
      <Form.Row className="align-items-center">
        <Col xs sm={6}>
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
        </Col>
      </Form.Row>
    </Form>
  );
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired
};