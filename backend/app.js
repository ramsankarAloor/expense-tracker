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
const compression = require("compression");

const userRoutes = require("./routes/user.js");
const loginSignupRoutes = require("./routes/login-signup.js");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");
const resetPasswordRoutes = require("./routes/resetpassword");
const reportRoutes = require("./routes/report");

app.use(compression()); // for compressing css and js files mainly, image files are not compressed.
app.use(cors());
app.use(express.json());

app.use("/auth", loginSignupRoutes);
app.use("/user", userRoutes);
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
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
