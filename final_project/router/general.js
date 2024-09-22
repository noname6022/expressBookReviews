const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required!" });
  } else if (password.length <= 6) {
    return res.status(400).json({ message: "create a longer password!" });
  }

  if (!isValid(username)) {
    users.push({
      username: username,
      password: password,
      currDate: new Date(),
    });
    return res.status(201).json({ message: "User registered successfully!" });
  } else {
    return res.status(404).json({ message: "username is taken!" });
  }
});
//Code method with promises start they are commented as default
// const getBooks = async () => {
//   return Promise.resolve(books);
// };

// public_users.get("/", async (req, res) => {
//   try {
//     const booksData = await getBooks();
//     return res.status(200).json(booksData);
//   } catch (error) {
//     return res.status(500).json({ message: "Error for fetching books (Promises method code toggled)" });
//   }
// });

// public_users.get("/isbn/:isbn", async (req, res) => {
//   const isbn = req.params.isbn;

//   try {
//     const bookData = await getBooks();
//     if (bookData[isbn]) {
//       return res.status(200).json(bookData[isbn]);
//     } else {
//       return res.status(404).json({ message: "Book not found (Promises method code toggled)" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Error retrieving book (Promises method code toggled)" });
//   }
// });

// public_users.get("/author/:author", async (req, res) => {
//   const author = req.params.author.toLowerCase();

//   try {
//     const booksData = await getBooks();
//     const filteredBooks = Object.values(booksData).filter(
//       (book) => book.author.toLowerCase() === author
//     );

//     if (filteredBooks.length > 0) {
//       return res.status(200).json(filteredBooks);
//     } else {
//       return res
//         .status(404)
//         .json({ message: "No books found for this author (Promises method code toggled)" });
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Error retrieving books by author (Promises method code toggled)" });
//   }
// });

// public_users.get("/title/:title", async (req, res) => {
//   const title = req.params.title.toLowerCase();

//   try {
//     const booksData = await getBooks();
//     const filteredBooks = Object.values(booksData).filter(
//       (book) => book.title.toLowerCase() === title
//     );

//     if (filteredBooks.length > 0) {
//       return res.status(200).json(filteredBooks);
//     } else {
//       return res.status(404).json({ message: "No books found for this title (Promises method code toggled)" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Error retrieving books by title (Promises method code toggled)" });
//   }
// });

//Code method with promises end

//Method code without async start (comment async logic to make it work)

public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const authors = req.params.author.toLowerCase();
  const book_arr = Object.values(books).filter(
    (book) => book.author.toLowerCase() === authors
  );

  if (book_arr.length > 0) {
    return res.status(200).json(book_arr);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const titles = req.params.title.toLowerCase();
  const book_arr = Object.values(books).filter(
    (book) => book.title.toLowerCase() === titles
  );

  if (book_arr.length > 0) {
    return res.status(200).json(book_arr);
  } else {
    return res.status(404).json({ message: "No books found for this title" });
  }
});

//Method code without async end

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  const book_review = books[isbn];

  if (book_review && book_review.reviews) {
    return res.status(200).json(book_review.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
