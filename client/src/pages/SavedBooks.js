import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import Auth from '../utils/auth';

import { useMutation, useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  // Get me query
  const { data } = useQuery(GET_ME);
  // Remove book mutation
  const [removeBook] = useMutation(REMOVE_BOOK);

  useEffect(() => {
    if (data?.me) {
      setUserData(data.me)
    }
  }, [data])


  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: {
          bookId
        },
      });
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return (
      <div className='full-width'>
        <img className='center' src={loadingIcon}  alt='Loading Spinner'/>
      </div>
    );
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-black bl bg-black'>
        <Container>
          <h1 className='general-text'>Your Books</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2 className='book-results'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}`
            : 'You have no saved books!'}
        </h2>
        <CardColumns className='card-container'>
          {userData.savedBooks.map((book) => {
            return (
              <Card  className='card' key={book.bookId} border='dark'>
                {book.image ? <div className='img-container'><Card.Img src={book.image} className='round' alt={`The cover for ${book.title}`} variant='top' /></div> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p>Authors: {book.authors}</p>
                  <Card.Text style={{opacity: '0.8', lineHeight: '30px'}}>{`${book.description.slice(0, 80)} . . .`}</Card.Text>
                  <Button className='btn-block btn-danger bg-bl hover' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete Book
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
