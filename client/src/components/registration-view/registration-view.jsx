import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password, email, birthday);
    // Send a request to the server for authentication then call props.onLoggedIn(username)
    props.onRegister(username);

  };

  return (
    <Form style={{ margin: '20px' }}>
      <Form.Row className="align-items-center">
        <Col xs sm={6}>
          <Form.Group>
            <Form.Label>Username:</Form.Label>
            <Form.Control type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="date">
            <Form.Label>Date of Birth:</Form.Label>
            <Form.Control type="date" value={birthday} onChange={e => setBirthday(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Col>
      </Form.Row>
    </Form>
  )
}

RegistrationView.propTypes = {
  onRegister: PropTypes.func.isRequired
};