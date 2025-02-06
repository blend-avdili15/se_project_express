const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  ERROR_CONFLICT,
  ERROR_UNAUTHORIZED,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      res
        .status(ERROR_UNAUTHORIZED)
        .send({ message: "Incorrect email or password" });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." })
    );
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(ERROR_CONFLICT)
          .send({ message: "Email already is use" });
      }
      if (err.code === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch(() => {
      res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error occurred on the server" });
    });
};

const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(ERROR_NOT_FOUND).send({ message: "User not found" });
      }
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateUserProfile,
};
