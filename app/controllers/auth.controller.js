const db = require("../models");
const User = db.User;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Create and Save a new User
exports.signup = async (req, res) => {
  const { email, password, username } = req.body
  // Validate request
  if (!(email && password && username)) {
    res.status(400).json({ success: false, msg: "Content can not be empty!" });
    return;
  }

  const oldUser = await User.findOne({ email })

  const encryptedPassword = await bcrypt.hash(password, 10);

  if (oldUser) {
    return res.status(409).json({ success: false, msg: 'User already exist!' })
  }
  // Create a User
  const user = new User({
    email,
    name: username,
    password: encryptedPassword,
  });

  // Save User in the database
  user
    .save(user)
    .then(data => {
      res.status(201).json({ success: true, user: data, msg: 'User created successfully!' });
    })
    .catch(err => {
      res.status(500).send({
        msg:
          err.msg || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users from the database.
exports.login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).json({ success: false, msg: 'Invalid Account' });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.status == 'Normal') {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email: email, status: user.status, name: user.name, type: user.type },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save user token
        user.token = token;
        res.cookie('token', token)
        user.save();
        // user
        res.status(200).json({ success: true, user: user, msg: 'Login successfully!' });
      } else {
        res.status(403).json({ success: false, msg: `Your Account is ${user.status}!` })
      }

    }
    res.status(400).json({ success: false, msg: 'Invalid Account' });
  } catch (err) {
    console.log(err);
  }
};

// Log out
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({success: true})
};

// Auth check
exports.check = async (req, res) => {
  const user = req.user
  res.status(200).json({success: true, user})
}

// Update a User by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      msg: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          msg: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } else res.send({ msg: "User was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        msg: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          msg: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          msg: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        msg: "Could not delete User with id=" + id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then(data => {
      res.send({
        msg: `${data.deletedCount} Users were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        msg:
          err.msg || "Some error occurred while removing all Users."
      });
    });
};

// Find all published Users
exports.findAllPublished = (req, res) => {
  User.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        msg:
          err.msg || "Some error occurred while retrieving Users."
      });
    });
};
