const { UserModel, BookModel } = require("../models");
const IssuedBook = require("../dtos/book-dto");

exports.getAllBooks = async(req,res) => {
  const book = await BookModel.find();
  
  if(books.length === 0)
    return res.status(404).json({
      success : false,
      message : "No Book Found",
    });
  res.status(200).json({
    success : false,
    data : book,
  })
};

exports.getSingleBookById = async(req,res) => {
  const {id} = req.params;
  const book = await BookModel.findById(id);
  if(!book){
    return  res.status(404).json({
      success : false,
      message : "Book Not Found",
    });
  }
  res.status(200).json({
    sucess : true,
    data : book,
  });
};

exports.getAllIssuedBooks = async(req,res) =>{
  const users = await UserModel.find({
    issuedBook : {$exists: true},
  }).populate("issuedBook");

  const issuedBooks = users.map((each) => new IssuedBook(each));

  if (issuedBooks.length === 0)
    return res.status(404).json({
      success: false,
      message: "No books issued yet",
  });

  return res.status(200).json({
    success: true,
    data: issuedBooks,
  });
}