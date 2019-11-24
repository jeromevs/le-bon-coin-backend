require("dotenv").config();

const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const formidableMiddleware = require("express-formidable");

const app = express();
app.use(formidableMiddleware());
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(cors());

require("./models/User");
require("./models/Offer");

const sign_upRoutes = require("./routes/sign_up");
app.use(sign_upRoutes);

const log_inRoutes = require("./routes/log_in");
app.use(log_inRoutes);

const publishRoutes = require("./routes/publish");
app.use(publishRoutes);

app.listen(4000, () => {
  console.log("server started");
});
