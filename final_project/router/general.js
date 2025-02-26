// Import necessary modules
const express = require('express');

// Import database of books and authentication functions
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// Create a router instance for public user routes
const public_users = express.Router();

// Route: Register a new user
public_users.post("/register", (req, res) => {
  // Extract user data from request body
  const { username, password } = req.body;

  // Check if required fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username is already taken
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Hash the password before saving it to the database (using bcrypt, for example)
  const hashedPassword = hashPassword(password);

  // Save the user data to the database
  const newUser = { username, password: hashedPassword };
  users.push(newUser);

  return res.status(200).json({ message: "User registered successfully" });
});

// Function to hash the password
function hashPassword(password) {
  // Implement password hashing logic (using bcrypt or any other suitable library)
  return password; // For demonstration purposes, returning the password as is
}

// Route: Get the list of available books
public_users.get('/', function (req, res) {
  // Retrieve the list of available books from the database or any other source
  const availableBooks = Object.values(books.books); // Convert books object to an array

  // Check if there are available books
  if (availableBooks.length === 0) {
    return res.status(404).json({ message: "No books available" });
  }

  // If books are available, send them as a response
  return res.status(200).json(availableBooks);
});

// Route: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Extract ISBN from request parameters
  const isbn = req.params.isbn;

  // Implement logic to fetch and return book details for the specified ISBN
  const book = books.getBookByISBN(isbn);

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Route: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Extract author from request parameters
  const author = req.params.author;

  // Implement logic to fetch and return book details for the specified author
  const booksByAuthor = books.getBooksByAuthor(author);

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "Books by this author not found" });
  }
});

// Route: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Extract title from request parameters
  const title = req.params.title;

  // Implement logic to fetch and return book details for the specified title
  const booksWithTitle = books.getBooksByTitle(title);

  if (booksWithTitle.length > 0) {
    return res.status(200).json(booksWithTitle);
  } else {
    return res.status(404).json({ message: "Books with this title not found" });
  }
});

// Route: Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Extract ISBN from request parameters
  const isbn = req.params.isbn;

  // Implement logic to fetch and return book review for the specified ISBN
  const bookReview = books.getBookReviewByISBN(isbn);

  if (bookReview && Object.keys(bookReview).length > 0) {
    return res.status(200).json({ review: bookReview });
  } else {
    return res.status(404).json({ message: "Review for this book not found" });
  }
});

// Export the router containing public user routes
module.exports.general = public_users;