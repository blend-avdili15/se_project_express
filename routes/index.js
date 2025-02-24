const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const { validateAuth, validateUserBody } = require("../middlewares/validation");
const { NotFoundError } = require("../errors/NotFoundError");

router.post("/signin", validateAuth, login);
router.post("/signup", validateUserBody, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
