const express = require("express");
const router = express.Router();
const User = require("../models/User");

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//############ READ

//############ Create

router.post("/user/sign_up", async (req, res) => {
  const token = uid2(64);
  const salt = uid2(64);
  const hash = SHA256(req.fields.password + salt).toString(encBase64);

  try {
    const newUser = new User({
      email: req.fields.email,
      token: token,
      salt: salt,
      hash: hash,
      account: { username: req.fields.username }
    });
    await newUser.save();
    res.json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "An error occured" });
  }
});

module.exports = router;
