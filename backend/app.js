const fs = require("fs");
const path = require("path");
require("dotenv").config();

const express = require("express");

const app = express();

const sequelize = require("./util/database");
const cors = require("cors");
const Users = require("./models/users");
const Expenses = require("./models/expenses");
const Orders = require("./models/orders");
const Forgotpassword = require("./models/forgotpassword");
const Downloads = require("./models/downloads");
// const helmet = require("helmet");
const compression = require("compression");
// const morgan = require("morgan");

const userRoutes = require("./routes/user.js");
const loginSignupRoutes = require("./routes/loginSignup");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");
const resetPasswordRoutes = require("./routes/resetpassword");
const reportRoutes = require("./routes/report");

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );

// app.use(helmet()); // for safety headers
// app.use(morgan("combined", { stream: accessLogStream }));
app.use(compression()); // for compressing css and js files mainly, image files are not compressed.
app.use(cors());
app.use(express.json());

app.use("/check", (req, res) => {
  console.log("hello");
  res.json({ msg: "hello guys..!" });
});

app.use(userRoutes);
app.use(loginSignupRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", resetPasswordRoutes);
app.use("/report", reportRoutes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

Users.hasMany(Expenses);
Users.hasMany(Orders);
Users.hasMany(Forgotpassword);
Users.hasMany(Downloads);

sequelize
  .sync()
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));
