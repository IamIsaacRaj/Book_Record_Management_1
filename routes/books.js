const express = require('express');
const { getAllBooks, getSingleBookById, getAllIssuedBooks } = require('../controllers/book-controller');
const { books } = require("../data/books.json");
const {users} = require("../data/users.json");

const router = express.Router();
/** 
   * Route : /books
   * method : GET
   * Description : Get all books
   * Acess : public
   * Parameter : none
*/ 
router.get('/',getAllBooks);

/** 
 * Route :/books/:id
 * method : GET
 * Description : Get single book by id
 * Acess : public
 * Parameter : id
 */ 

 router.get('/:id',getSingleBookById);

/** 
 * Route :/issued/by_user
 * method : GET
 * Description : Get single book by id
 * Acess : public
 * Parameter : id
*/ 

router.get("/issued/by_user",getAllIssuedBooks);

/** 
 * Route :/book
 * method : POST
 * Description : create new book
 * Acess : public
 * Parameter : none
 * date : authour, name, gener,price,publisher,id 
*/ 
router.post("/",(req,res) => {
  const data = req.body;

  if(!data){
    return res.status(400).json({
      success : false,
      message : "No data is provided",
    });
  }

  const book = books.find((each) => each.id === data.id);

  if(book){
    return res.status(404).json({
      success : false,
      message : "Book already exits with this id, please provide a unique id",
    });
  }

  const allBooks = [...books,data];

  return res.status(200).json({
    success : true,
    message : allBooks,
  })
})

/** 
 * Route :/book/:id
 * method : PUT
 * Description : Update book
 * Acess : public
 * Parameter : id
 * date : authour, name, gener,price,publisher 
*/ 

router.put("/:id", (req,res) => {
  const { id } = req.params;
  const{ data } = req.body;

  const book = books.find((each) => each.id === id);

  if(!book){
    return res.status(400).json({
      success : false,
      message : "Book Not Found",
    });
  }

  const updateBooK = books.map((each) => {
    if(each.id === id){
      return {...each,...data} ;
    } else {
      return each;
    }
  });

  return res.status(200).json({
    success : true,
    data : updateData
  });
});

/**
   * Route: /books/issued/with-fine
   * Method: GET
   * Description: Get issued books with fine
   * Access: Public
   * Parameters: none
 */

 router.get("/issued/with-fine", (req, res) => {
  const usersWithIssuedBooksWithFine = users.filter((each) => {
      if (each.issuedBook) return each;
  });

  const issuedBooksWithFine = [];

  usersWithIssuedBooksWithFine.forEach((each) => {
      const book = books.find((book) => book.id === each.issuedBook);

      book.issuedBy = each.name;
      book.issuedDate = each.issuedDate;
      book.returnDate = each.returnDate;


      const getDateInDays = (data = "") => {
          let date;
          if (data === "") {
              date = new Date();
          } else {
              date = new Date(data);
          }
          let days = Math.floor(date / (1000 * 60 * 60 * 24)); //1000 is for milliseconds
          return days;
      };

      let returnDate = getDateInDays(each.returnDate);

      let currentDate = getDateInDays();

      if (returnDate < currentDate) {
          issuedBooksWithFine.push(book);
      }
  });

  if (issuedBooksWithFine.length === 0) {
      return res.status(404).json({
          Success: false,
          Message: "No books which have fine",
      });
  }

  return res.status(200).json({
      Success: true,
      Message: "Issued Books List which have fine",
      Data: issuedBooksWithFine,
  })
});


//default export
module.exports = router