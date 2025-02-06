const ClothingItem = require("../models/clothingItem");

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  ERROR_FORBIDDEN,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) =>
      res.status(ERROR_INTERNAL_SERVER).send({ message: err.message })
    );
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({ message: err.message });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: err.message });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(ERROR_NOT_FOUND).send({ message: "Item not found" });
      }
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(ERROR_FORBIDDEN)
          .send({ message: "You are not allowed to delete this item" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.send({ message: "Item deleted successfully" })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_BAD_REQUEST).send({ message: err.message });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(ERROR_NOT_FOUND).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(ERROR_NOT_FOUND).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
