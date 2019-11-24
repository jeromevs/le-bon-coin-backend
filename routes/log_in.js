const express = require("express");
const router = express.Router();
const User = require("../models/User");

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post("/user/log_in", async (req, res) => {
  const findUser = await User.findOne({ email: req.fields.email });
  try {
    if (findUser) {
      if (
        SHA256(req.fields.password + findUser.salt).toString(encBase64) ===
        findUser.hash
      ) {
        return res.json({
          _id: findUser._id,
          token: findUser.token,
          account: findUser.account
        });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      return res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: "An error occured" });
  }
});

module.exports = router;
