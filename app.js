const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");
const mainRouter = require("./routes/index");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(helmet());
app.use(cors());

// Enable request logging before routes
app.use(requestLogger);

// routes
app.use("/", mainRouter);

// enable error logging after routes
app.use(errorLogger);
app.use(errors());

// centralized error handler
app.use(errorHandler);

app.use("/items", require("./routes/clothingItems"));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
