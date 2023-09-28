const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { v4: uuidv4 }= require('uuid');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    //console.log(req.body)
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      uuid: uuidv4(),
    });

    console.log(user);
    const newUser = await user.save();
    res.status(200).json(newUser);
  }
  catch (err){
    res.status(500).send({message: err});
  }
  // user.save((err, user) => {
  //   user.save(err => {
  //     if (err) {
  //       res.status(500).send({ message: err });
  //       return;
  //     }

  //     res.send({ message: "User was registered successfully!" });
  //   });
  // });
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username
    })
    if(!user) {
      return res.status(404).send({message: 'User not found.'});
    }

    let passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    )

    if(!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid password."
      })
    }
    if (passwordIsValid) {
      const token = jwt.sign({ id: user._id },
        process.env.JWT_SECRET,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 86400, // 24 hours
        });
      return res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
      });
    }
  }
  catch {
    res.status(500).json({error: 'something went wrong'});
    console.error(err);
  }
}
