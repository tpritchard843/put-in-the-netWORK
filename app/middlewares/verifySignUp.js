const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try{
    const checkUsername = await User.findOne({username: req.body.username});
    const checkEmail = await User.findOne({email: req.body.email});
    if (checkUsername) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }
    if (checkEmail) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }
    if (!checkUsername && !checkEmail) {
      res.status(200).send({message: 'Successful search. User is unique'});
      return;
    }
    next();
  }catch (err){
    res.status(500).send({ message: err });
    return;
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;
