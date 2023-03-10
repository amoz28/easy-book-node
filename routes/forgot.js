const express = require("express");
const db = require("../startup/db");
const router = express.Router();

// Forgot password route
router.get("/forgot", async (req, res) => {
  const email = req.body.email;

  if (email.length === 0) {
    res.status(400).json("Email is required");
  }

  try {
    // Check if user with the given email exists
    const query = `SELECT email FROM users WHERE email = '${email}'`;
    db.query(query, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json("Error while accessing the database");
      }

      if (!result[0]) {
        res.status(400).send("User with the given email does not exist");
      }

      res.send("Reset Password");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error while accessing the database");
  }
});

module.exports = router;
