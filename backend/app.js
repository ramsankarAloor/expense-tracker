
const express = require("express");
const sequelize = require("./util/database");
const cors = require("cors");
const Users = require('./models/users');
const Expenses = require('./models/expenses');
const Orders = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const Downloads = require('./models/downloads');

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/user.js');
const loginSignupRoutes = require('./routes/loginSignup');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const resetPasswordRoutes = require('./routes/resetpassword');
const reportRoutes = require('./routes/report');

app.use(userRoutes);
app.use(loginSignupRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use('/password', resetPasswordRoutes);
app.use('/report', reportRoutes);

Users.hasMany(Expenses);
Users.hasMany(Orders);
Users.hasMany(Forgotpassword);
Users.hasMany(Downloads);

sequelize
  .sync()
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));
