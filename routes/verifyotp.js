const db = require("../startup/db");
const express = require("express");
const router = express.Router();
const checkRole = require(".././middleware/auth")

router.post("/verify-otp", async (req, res) => {
  try {
    let email = req.body.email;
    let otp = req.body.otp;

    // Validation: check if the required fields are provided
    if (!email || !otp) {
      res.status(400).json("Both email and OTP are required");
    }

    // Check if the email exists in the database
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    db.query(query, async (error, result) => {
      if (error) {
        res.status(400).json(error.code);
      }

      // Return an error if the email is not found
      if (result.length === 0) {
        res.status(400).json("Email not found");
      }

      // Return an error if the OTP is incorrect
      if (result[0].otp !== otp) {
        res.status(400).json("Incorrect OTP");
      }

      // Check if the OTP has expired
      const expirationDate = new Date(result[0].expirationDate);
      const currentDate = new Date();
      if (currentDate > expirationDate) {
        res.status(400).json("OTP is invalid");
      }

      // Update the user's verified status
      const query = `UPDATE users SET isActive = 1 WHERE email = '${email}'`;
      db.query(query, (error) => {
        if (error) {
          res.status(400).json(error.code);
        }

        res.send("Email verified successfully");
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
