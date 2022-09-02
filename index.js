const express = require("express");
const dotenv = require('dotenv');
//database connection
const Dbconnection = require("./DBconnection")
//importing routes
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

dotenv.config();

const app = express();

Dbconnection();

const PORT = 8085
app.get("/", (req,res) => {
  res.status(200).json({
    message : "server is up and running"
  });
});

app.use("/user",usersRouter);
app.use("/books",booksRouter);

app.get("*", (req,res) =>{
  res.status(404).json({
    message : "This route does not exits"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`)
});

// http://localhost:8085