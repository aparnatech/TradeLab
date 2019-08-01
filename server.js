const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const UserAuth = require("./routes/userRoutes");
const cors = require('cors');
const Auth = require('./routes/auth');
const product = require('./routes/Product');


// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cors());
app.use(bodyParser.json({limit: '100mb'}));
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB

app.use("/api/userRegister", UserAuth);
app.use("/api/auth", Auth);
app.use("/api/pro", product);



mongoose
  .connect(
    db,
    { useNewUrlParser: true, useCreateIndex:true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));