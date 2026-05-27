const bcrypt = require("bcrypt");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check existing user
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        if (user) {
          return res.status(400).json({
            message: "User already exists",
          });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        db.run(
          `INSERT INTO users (name, email, password)
           VALUES (?, ?, ?)`,
          [name, email, hashedPassword],
          function (err) {
            if (err) {
              return res.status(500).json({
                message: err.message,
              });
            }

            res.status(201).json({
              id: this.lastID,
              name,
              email,
              token: generateToken(this.lastID),
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN USER
const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        if (!user) {
          return res.status(401).json({
            message: "Invalid email or password",
          });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
          password,
          user.password
        );

        if (!isMatch) {
          return res.status(401).json({
            message: "Invalid email or password",
          });
        }

        res.status(200).json({
          id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user.id),
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};