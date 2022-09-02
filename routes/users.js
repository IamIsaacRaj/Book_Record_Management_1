const express = require("express");

const {users} = require("../data/users.json");

const router = express.Router();

/** 
 * Route : /user
 * method : GET
 * Description : Get all users
 * Acess : public
 * Parameter : none
 */ 
 router.get('',(req,res) => {
  res.status(200).json({
    success : true,
    data : users,
  });
});

/** 
 * Route :/user/:id
 * method : GET
 * Description : Get single users by id
 * Acess : public
 * Parameter : id
 */ 

 router.get('/:id',(req,res) => {
  const {id} = req.params;
  const user = users.find((each) => each.id === id);
  if(!user){
    return  res.status(404).json({
      success : false,
      message : "User Not Found",
    });
  }
  res.status(200).json({
    sucess : true,
    data : user,
  });
});

/**
 * Route: /users
 * Method: POST
 * Description: Create new user
 * Access: Public
 * Parameters: none
 */
 router.post("/", (req, res) => {
  const { id, name, surname, email, subscriptionType, subscriptionDate } =
    req.body;

  const user = users.find((each) => each.id === id);

  if (user) {
    return res.status(404).json({
      success: false,
      message: "User exists with this id",
    });
  }

  users.push({
    id,
    name,
    surname,
    email,
    subscriptionType,
    subscriptionDate,
  });
  return res.status(201).json({
    success: true,
    data: users,
  });
});

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating user data
 * Access: Public
 * Parameters: id
 */
 router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const user = users.find((each) => each.id === id);

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const updatedUser = users.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });

  return res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

/** 
 * Route :/user/:id
 * method : DELETE
 * Description : Get single users by id
 * Acess : public
 * Parameter : id
 */ 

 router.delete('/:id',(req,res) => {
  const {id} = req.params;
  const user = users.find((each) => each.id === id);
  if(!user){
    return  res.status(404).json({
      success : false,
      message : "User to  be DELETED Not Found",
    });
  }
   const index = users.indexOf(user);
   users.splice(index,1)
    res.status(200).json({
      sucess : true,
      data : users,
    });
});

/** 
 * Route :/user/subscription-details/:id
 * method : GET
 * Description : Get all users subscription details by id
 * Acess : public
 * Parameter : id
 */ 
router.get('/subscription-details/:id',(req,res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if(!user) {
    return res.status(404).json({
      success : false,
      message : "User Not Found", 
    });
  }
  const getDateInDays = (data = "") => {
    let date;
    if(data === "") {
      //current date 
      date = new Date();
    } else {
      // getting date on basis of data provided
      date = new Date(data);
    }
    let days = Math.floor(date / (1000*60*60*24));
    return days;
  };

  const subscriptionType = (date) => {
    if(user.subscriptionType === "Basic" ){
      date = date + 90;
    } else  if(user.subscriptionType === "Standard" ){
      date = date + 180;
    } else  if(user.subscriptionType === "Premium" ){
      date = date + 365;
    }
    return date;
  };

  // subscription expiration calculation

  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays();
  let subscriptionDate = getDateInDays(user.subscriptionDate);
  let subscriptionExpiration = subscriptionType(subscriptionDate);

  const data = {
    ...user,
    subscriptionExpired : 
      subscriptionExpiration < currentDate,
    daysLeftForExpiration : 
      subscriptionExpiration <= currentDate 
      ? 0 
      : subscriptionExpiration - currentDate,
    fine : 
      returnDate < currentDate 
      ? subscriptionExpiration <= currentDate 
        ? 200 : 100
      : 0
  }
  res.status(200).json({
    sucess : true,
    data ,
  })

})


//default export
module.exports = router