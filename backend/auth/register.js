const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const pool = require("../database/database.js");

router.post("/", async (req, res) => {
  const { user_name, email, password, role, specialty, license_number, experience_years, date_of_birth, gender, insurance_number, full_name } = req.body;

  if (!user_name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!["doctor", "patient", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role provided" });
  }

  try {
    // Check if the user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).send("User already exists");
    }
   // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
   // Insert user into the `users` table
    const insertUserQuery = `INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *;`;
    const insertUserValues = [user_name, email, hashedPassword, role];
    const userResult = await pool.query(insertUserQuery, insertUserValues);

    const newUser = userResult.rows[0];

    // Insert into role-specific table
    switch (role) {
      case "doctor":
        if (!specialty || !license_number || !experience_years) {
          return res.status(400).json({ error: "Missing required doctor fields" });
        }
        await pool.query(`INSERT INTO doctors (user_id, specialty, license_number, experience_years) VALUES ($1, $2, $3, $4);`,[newUser.id, specialty, license_number, experience_years]);
        break;

      case "patient":
        if (!date_of_birth || !gender) {
          return res.status(400).json({ error: "Missing required patient fields" });
        }
        await pool.query(`INSERT INTO patients (user_id, date_of_birth, gender, insurance_number) VALUES ($1, $2, $3, $4);`,[newUser.id, date_of_birth, gender, insurance_number || null]);
        break;

      case "admin":
        if (!full_name) {
          return res.status(400).json({ error: "Missing required admin fields" });
        }
        await pool.query(`INSERT INTO administrators (user_id, full_name)VALUES ($1, $2);`,[newUser.id, full_name]);
        break;

      default:
        return res.status(400).json({ error: "Invalid role" });
    }

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating user" });
  }
});

module.exports = router;
