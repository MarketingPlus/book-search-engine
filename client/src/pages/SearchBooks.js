import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Form, Button, Card, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';

import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';

import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

// Third party google books API
const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};

const SearchBooks = () => {

  const [save] = useMutation(SAVE_BOOK);

  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description || 'No Description',
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const {authors, description, title, bookId, image} = {...bookToSave};

      await save({
        variables: { 
        authors, 
        description: description || 'No Description', 
        title, 
        bookId, 
        image: image || 'No Image',
        link: `https://books.google.com/ebooks?id=${bookId}` },
      });
      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-black'>
        <Container>
          <h1 className='bl header'>Google Books</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row className='form flex-row justify-content-center m-5'>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Try typing "Star Wars"'
                  className='input'
                />
                <button className='button bg-primary text-white' type='submit'>Submit</button>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {searchedBooks.length
            ? ``
            : ''}
        </h2>
        <CardColumns className='card-container'>
          {searchedBooks.map((book) => {
            return (
              <Card className='card' key={book.bookId} border='dark'>
                {book.image ? (
                  <div className='img-container'>
                      <Card.Img className='image round' src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  </div>
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p>Authors: {book.authors}</p>
                  <Card.Text style={{opacity: '0.8', lineHeight: '30px'}}>{`${book.description.slice(0, 90)} . . .`}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      className='btn-block btn-info bg-bl'
                      onClick={() => handleSaveBook(book.bookId)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'Already Saved'
                        : 'Save Book'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchBooks;
