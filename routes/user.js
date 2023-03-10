const db = require("../startup/db");
const express = require("express");
const router = express.Router();
const checkRole = require("../middleware/auth");
const roles = require("../roles");

// Route to get user info for both user and admin
router.get("/user", checkRole(["admin", "user"]), async (req, res) => {
  const userEmail = req.user.email;
  const userRole = req.user.role;

  try {
    let query = "SELECT id, username, email, role FROM users";
    if (userRole === "user" || userRole === "admin") {
      query += ` WHERE email = '${userEmail}'`;
    }
    await db.query(query, (err, result) => {
      if (err) {
        console.error(err.error);
      } else {
        console.log(result);
        res.json(result);
      }
    });
  } catch (error) {
    console.error(error);
    console.error(error.stack);
    res.status(500).json({ error: "Error while accessing the database" });
  }
});

// Route to get all user info for only admin
router.get("/all-users", checkRole(["admin"]), async (req, res) => {
  try {
    const query = "SELECT id, username, email, role FROM users";
    await db.query(query, (err, result) => {
      if (err) {
        console.error(err.error);
      } else {
        console.log(result);
        res.json(result);
      }
    });
  } catch (error) {
    console.error(error);
    console.error(error.stack);
    res.status(500).json({ error: "Error while accessing the database" });
  }
});

/// Route to delete user
router.delete("/remove-user", checkRole(["admin"]), async (req, res) => {
  try {
    const email = req.body.email;
    const query = `DELETE FROM users WHERE email = '${email}'`;

    await db.query(query, (err, result) => {
      if (err) {
        console.error(err.error);
        res.status(500).json({ error: "Error while accessing the database" });
      } else if (result.affectedRows === 0) {
        res.status(400).json({ error: "User not found" });
      } else {
        console.log(`User with email ${email} deleted`);
        res.json({ message: `User with email ${email} deleted` });
      }
    });
  } catch (error) {
    console.error(error);
    console.error(error.stack);
    res.status(500).json({ error: "Error while accessing the database" });
  }
});

// Route to update user role to admin
router.put("/update-user-role", checkRole(["admin"]), async (req, res) => {
  try {
    const id = req.body.id;
    const email = req.body.email;
    const query = `UPDATE users SET role = '${"admin"}' WHERE id = '${id}' AND email = '${email}'`;

    await db.query(query, (err, result) => {
      if (err) {
        console.error(err.error);
        res.status(500).json({ error: "Error while accessing the database" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        console.log(`User with id ${id} updated to admin`);
        res.json({ message: `User with id ${id} updated to admin` });
      }
    });
  } catch (error) {
    console.error(error);
    console.error(error.stack);
    res.status(500).json({ error: "Error while accessing the database" });
  }
});






module.exports = router;
