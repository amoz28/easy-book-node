const express = require("express");
const db = require("../startup/db");
const bcrypt = require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

router.post("/register", async (req, res) => {
  try {
    let user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,

    };

    // Validation: check if the required fields are provided
    if (!user.username || !user.email || !user.password) {
      res.status(400).json("All fields are required");
    }

    // Validation: check the length of the username
    if (user.username.length < 3 || user.username.length > 20) {
      res.status(400).json("Username must be between 3 and 20 characters long");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Generate an OTP
    let otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expirationDate = new Date();
    expirationDate.setMinutes(
      expirationDate.getMinutes() + process.env.OTP_DURATION_MINUTE
    );

    // Set up the email transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: false,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });

    // Set up the email options
    let mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: "Email OTP Verification",
      text: `This is your One Time Verification code: ${otp}. It expires at ${expirationDate}.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Insert the user information into the database
    const query = 'INSERT INTO users (username, email, password, otp, expirationDate) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [user.username, user.email, hashedPassword, otp, expirationDate], (error, results) => {
      if (error) {
        res.status(400).json(error.code);
      }

      res.send("User registered successfully");
    });
  } catch (error) {
    res.status(500).send("An error occurred while registering user.");
  }
});

module.exports = router;
