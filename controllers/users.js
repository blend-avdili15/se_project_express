const User = require("../models/user");

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require("../utils/errors");

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
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getUser };
