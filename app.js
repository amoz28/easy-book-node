const db = require("./startup/db");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

//request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes


const register = require("./routes/register");
app.use("/api", register);

const login = require("./routes/login");
app.use("/api", login);


const verifyotp = require("./routes/verifyotp");
app.use("/api", verifyotp);


const forgot = require("./routes/forgot");
app.use("/api", forgot);



const reset = require("./routes/reset");
app.use("/api", reset);


const user = require("./routes/user");
app.use("/api", user);

app.get("/", (req, res) => {
  res.send("Welcomes!!!");
});
    //
app.listen(3000, function () {
  console.log("listening on port 3000...");
});

