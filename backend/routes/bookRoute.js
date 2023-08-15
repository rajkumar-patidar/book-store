const express = require('express');
const { getAllBooks, createBook, updateBook, deleteBook, getBookDetails } = require('../controllers/bookController');
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

router.route("/").get(isAuthenticatedUser, getAllBooks);

router.route("/add-book").get(isAuthenticatedUser, (req, res) => {
  return res.render('addBook', {
    user: req.user
  }); 
});
router.route("/add-book").post(isAuthenticatedUser, createBook);

router.route("/book/:id")
    .post(isAuthenticatedUser, updateBook)
    .delete(isAuthenticatedUser, deleteBook);

router.route("/book/:id").get(isAuthenticatedUser, getBookDetails);

module.exports = router;

