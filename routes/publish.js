const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const User = require("../models/User");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post("/offer/publish", async (req, res) => {
  const auth = req.headers.authorization;
  //   console.log(req.headers.authorization);
  if (!auth) {
    res.status(401).json({
      error: "Missing Authorization Header"
    });
    return;
  }

  const parts = req.headers.authorization.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({
      error: "Invalid Authorization Header"
    });
    return;
  }
  const token = parts[1];

  const user = await User.findOne({ token });
  if (!user) {
    res.status(401).json({
      error: "Invalid Token"
    });
    return;
  }

  let file = {};
  const fileKeys = Object.keys(req.files);
  for (let i = 0; i < fileKeys.length; i++) {
    file = req.files[fileKeys];
  }

  cloudinary.v2.uploader.upload(file.path, async (error, result) => {
    if (error) {
      console.log("error");
    } else {
      try {
        const offer = new Offer({
          title: req.fields.title,
          description: req.fields.description,
          price: req.fields.price,
          creator: user._id,
          pictures: result.secure_url
        });
        await offer.save();
        res.json(offer);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  });
});

router.get("/offers/with-count", async (req, res) => {
  try {
    const readMyOffer = await Offer.find().populate("creator");

    res.json(readMyOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/offer/", async (req, res) => {
  let id = req.query.id;
  try {
    const offerSelected = await Offer.findById(id).populate("creator");
    console.log(offerSelected);
    res.json(offerSelected);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
