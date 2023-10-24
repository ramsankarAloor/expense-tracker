const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.postSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ err: "Bad parameters. Something is missing." });
    }
    const existing = await Users.findOne({
      where: { email: email },
    });
    if (existing) {
      return res.status(403).json({ err: "email not unique" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newEntry = await Users.create({ name, email, password: hash });
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.postLogIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ err: "Bad parameters. Something is missing." });
  }

  const existing = await Users.findOne({
    where: { email: email },
  });
  if (!existing) {
    return res.status(404).json({ err: "User not found" });
  } else {
    const savedPassword = existing.dataValues.password;
    //savedPassword is the hash
    const isMatch = await bcrypt.compare(password, savedPassword);
    if (!isMatch) {
      return res.status(401).json({ err: "User not authorized" });
    }
  }
  res.json({
    accessToken: generateAccessToken(existing.dataValues.id),
    message: "User logged successfully",
  });
};

function generateAccessToken(id_given) {
  return jwt.sign({ userId: id_given }, process.env.ACCESS_TOKEN_SECRET);
}
