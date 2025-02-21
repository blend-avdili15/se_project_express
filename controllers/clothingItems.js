// const ClothingItem = require("../models/clothingItem");

// const {
//   ERROR_BAD_REQUEST,
//   ERROR_NOT_FOUND,
//   ERROR_INTERNAL_SERVER,
//   ERROR_FORBIDDEN,
// } = require("../utils/errors");

// const getClothingItems = (req, res, next) => {
//   ClothingItem.find({})
//     .then((items) => res.send(items))
//     .catch(() =>
//       res
//         .status(ERROR_INTERNAL_SERVER)
//         .send({ message: "An error has occurred on the server" })
//     );
// };

// const createClothingItem = (req, res, next) => {
//   const { name, weather, imageUrl } = req.body;
//   const owner = req.user._id;

//   ClothingItem.create({ name, weather, imageUrl, owner })
//     .then((item) => res.status(201).send(item))
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         return res.status(ERROR_BAD_REQUEST).send({ message: err.message });
//       }
//       return res
//         .status(ERROR_INTERNAL_SERVER)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const deleteClothingItem = (req, res) => {
//   const { itemId } = req.params;

//   ClothingItem.findById(itemId)
//     .then((item) => {
//       if (!item) {
//         return res.status(ERROR_NOT_FOUND).send({ message: "Item not found" });
//       }
//       if (item.owner.toString() !== req.user._id) {
//         return res
//           .status(ERROR_FORBIDDEN)
//           .send({ message: "You are not allowed to delete this item" });
//       }
//       return ClothingItem.findByIdAndDelete(itemId).then(() =>
//         res.send({ message: "Item deleted successfully" })
//       );
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         return res.status(ERROR_BAD_REQUEST).send({ message: err.message });
//       }
//       return res
//         .status(ERROR_INTERNAL_SERVER)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const likeItem = (req, res) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.itemId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true }
//   )
//     .then((item) => {
//       if (!item) {
//         return res.status(ERROR_NOT_FOUND).send({ message: "Item not found" });
//       }
//       return res.send(item);
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         return res
//           .status(ERROR_BAD_REQUEST)
//           .send({ message: "Invalid item ID" });
//       }
//       return res
//         .status(ERROR_INTERNAL_SERVER)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

// const dislikeItem = (req, res) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.itemId,
//     { $pull: { likes: req.user._id } },
//     { new: true }
//   )
//     .then((item) => {
//       if (!item) {
//         return res.status(ERROR_NOT_FOUND).send({ message: "Item not found" });
//       }
//       return res.send(item);
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         return res
//           .status(ERROR_BAD_REQUEST)
//           .send({ message: "Invalid item ID" });
//       }
//       return res
//         .status(ERROR_INTERNAL_SERVER)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

// module.exports = {
//   getClothingItems,
//   createClothingItem,
//   deleteClothingItem,
//   likeItem,
//   dislikeItem,
// };

const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
} = require("../errors/CustomErrors");

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => next(new InternalServerError("Server error occurred")));
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(new InternalServerError("Server error occurred"));
      }
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError("You are not allowed to delete this item");
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => res.send({ message: "Item deleted successfully" }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
