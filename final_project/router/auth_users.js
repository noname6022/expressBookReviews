const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.find(
    (user) => user.username === username && user.password === password
  );
};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Enter username and password!" });
  }

  const user = authenticatedUser(username, password);
  if (user) {
    const accessToken = jwt.sign({ username: username }, "secret_key", {
      expiresIn: "1h",
    });
    req.session.accessToken = accessToken;
    req.session.username = username;
    return res.status(200).json({ message: "Successful login!" });
  }

  return res.status(401).json({ message: "Check your username or password." });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized, please log in." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = review;
    return res
      .status(200)
      .json({ message: `Review updated successfully by user ${username}` });
  } else {
    books[isbn].reviews[username] = review;
    return res
      .status(201)
      .json({ message: `Review added successfully by user ${username}` });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized, please log in." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user." });
  }

  delete books[isbn].reviews[username];
  return res
    .status(200)
    .json({ message: `Review deleted successfully by user ${username}` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
