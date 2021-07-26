import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

import Auth from '../utils/auth';

const AppNavbar = () => {

  // set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar className="bg-black bl nav" expand='lg'>
        <Container fluid >
          <Navbar.Brand as={Link} to='/'>
            
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar'>
            <Nav className='ml-auto extra'>
              <Nav.Link as={Link} to='/' className="nav-text">
              Home
              </Nav.Link>
              {/* if user is logged in show saved books and logout */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link className='bl nav-text' as={Link} to='/saved'>
                    Saved Books
                  </Nav.Link>
                  <Nav.Link className='nav-text' onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link className='nav-text' onClick={() => setShowModal(true)}>Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
        <Tab.Container className='border' defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title  id='signup-modal'>
              <Nav variant=''>
                <Nav.Item className='model'>
                  <Nav.Link className='bl' eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className='bl' eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
