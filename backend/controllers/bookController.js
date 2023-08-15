const Book = require('../models/bookModel');
const ErrorHandler = require('../utils/errorhander');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const { format } = require('date-fns');


//Add New Book Details - LoggedIn User Only
exports.createBook = catchAsyncErrors(async (req, res, next) => {
  const { title, description, price, author, category } = req.body;

    const newBook = new Book({
      user: req.user.id,
      title: title,
      description: description,
      price: price,
      author: author,
      category: category,
      pdf_url: '1691513649039-.pdf',
    });
    await newBook.save();
    res.redirect('/');
});


//Get all Book lists - LoggedIn User Only
exports.getAllBooks = catchAsyncErrors(async(req, res) => {
  
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = 5; // Number of books per page
  const search = req.query.search || '';
  const sortBy = req.query.sortBy || 'title'; // Default sort by title
    // Prepare the query
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } }, 
        { author: { $regex: search, $options: 'i' } }        
      ];
    }

    // Get total count of matching books for pagination
    const totalCount = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Make sure the requested page number is within valid range
    if (page < 1 || page > totalPages) {
      return res.status(404).send('Page not found.');
    }

    const skip = (page - 1) * limit;
    const books = await Book.find(query).sort(sortBy).skip(skip).limit(limit);
    
    // Format the published dates
    const formattedBooks = books.map(book => ({
      ...book.toObject(),
      formattedPublishedDate: format(book.publishedDate, 'yyyy-MM-dd HH:mm:ss') // Customize the format
    }));

    res.render('bookList', {
      books: formattedBooks,
      user: req.user,
      currentPage: page,
      totalPages,
      search,
      sortBy,
    }); 
});


//Update Book Details - LoggedIn User Only
exports.updateBook = catchAsyncErrors(async (req, res, next) => {
    let book = await Book.findById(req.params.id);
  
    if(!book) {
        return next(new ErrorHandler("Book not found!!", 500));
    }
    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    return res.redirect('/'); 
});


// Delete Book - LoggedIn User Only
exports.deleteBook = catchAsyncErrors(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    if(!book) {
        return res.render('addBook', {
          errors: {msg:"Book Detils not found."}
        }); 
    }
  
    await book.remove();  
    res.status(200).json({
      success: true,
      message: "Book Delete Successfully!!",
    });
});


// Get Book Details - LoggedIn User Only
exports.getBookDetails = catchAsyncErrors(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    if(!book) {
        return res.render('addBook', {
          errors: {msg:"Book not found!!"}
        }); 
    }
    res.render('editBook', {
      book: book,
      user: req.user
    }); 
});


