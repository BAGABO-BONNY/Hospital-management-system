const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const pool = require("../database/database.js");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Fetch user by email
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
   // Check user role and fetch specific role details
    let roleDetails = {};
    switch (user.role) {
      case "doctor":
        const doctorQuery = "SELECT * FROM doctors WHERE user_id = $1";
        const doctorResult = await pool.query(doctorQuery, [user.id]);
        if (doctorResult.rows.length > 0) {
          roleDetails = doctorResult.rows[0];
        }
        break;

      case "patient":
        const patientQuery = "SELECT * FROM patients WHERE user_id = $1";
        const patientResult = await pool.query(patientQuery, [user.id]);
        if (patientResult.rows.length > 0) {
          roleDetails = patientResult.rows[0];
        }
        break;

      case "admin":
        const adminQuery = "SELECT * FROM administrators WHERE user_id = $1";
        const adminResult = await pool.query(adminQuery, [user.id]);
        if (adminResult.rows.length > 0) {
          roleDetails = adminResult.rows[0];
        }
        break;

      default:
        return res.status(400).json({ error: "Invalid role detected" });
    }
   // Successful login
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        details: roleDetails, // Role-specific details
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error logging in" });
  }
});

module.exports = router;
