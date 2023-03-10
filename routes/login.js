const express = require("express");
const db = require("../startup/db");
const bcrypt = require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

// Route for logging in a user
router.post("/login", async (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };

    if (!user.email || !user.password) {
      res.status(400).json("All fields are required");
    }

    const query = `SELECT password, role FROM users WHERE email = '${user.email}'`;
    db.query(query, async (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json("Error while accessing the database");
      }
      if (result.length === 0) {
        return res.status(400).json("User not found");
      }

      const registeredUser = result[0];
      const validPassword = await bcrypt.compare(
        user.password,
        registeredUser.password
      );
      if (!validPassword) {
        res.status(400).json("Incorrect email or password");
      }

      jwt.sign(
        { email: user.email, role: registeredUser.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2h" },
        (err, token) => {
          if (err) {
            console.error(err);
            res.status(500).json("Error while generating JWT token");
          }
          res.json(token);
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});


module.exports = router;
