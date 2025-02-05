const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

// Unprotected Routes
app.post("/signin", require("./controllers/users").login);
app.post("/signup", require("./controllers/users").createUser);
app.get("/items", require("./controllers/clothingItems").getClothingItems);
/////////////

app.use(auth);

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
