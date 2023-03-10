const express = require("express");
const db = require("../startup/db");
const bcrypt = require("bcrypt");
const router = express.Router();

// Reset password route
router.put("/reset", async (req, res) => {
  const email = req.body.email;
  const newPassword = req.body.newPassword;

  try {
    // Check if user with the given email exists
    const query = `SELECT email FROM users WHERE email = '${email}'`;
    const result = await db.query(query, (error, result) => {
      if (error) {
        res.status(500).json("Error");
      }
      if (!result[0]) {
        res.status(400).send("User with the given email does not exist");
      }
    });
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const updateQuery = `UPDATE users SET password = '${hashedPassword}' WHERE email = '${email}'`;
      await db.query(updateQuery);
      
    res.send("Password reset successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Error");
  }
});

module.exports = router;
