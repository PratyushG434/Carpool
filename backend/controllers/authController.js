import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import pool from "../config/db.js"; 


// User Registration
export const registerUser = async (req, res) => {
    const { name, email, contact, password } = req.body;
    console.log(name,email,contact,password);
    if (!email.endsWith("@iiti.ac.in")) {
        return res.status(400).json({ message: "Only IITI emails are allowed." });
    }

    try {
        const checkResultEmail = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const checkResultContact = await pool.query("SELECT * FROM users WHERE contact = $1", [contact]);

        if (checkResultEmail.rows.length > 0 || checkResultContact.rows.length > 0) {
            return res.status(409).json({ message: "Email or phone number already registered" });
        }

        // Hash the password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (hashingError) {
            console.error("Error hashing password:", hashingError);
            return res.status(500).json({ message: "Error processing your password. Please try again." });
        }

        // Insert user into the database
        try {
            const result = await pool.query(
                "INSERT INTO users (name, email, password, contact) VALUES ($1, $2, $3, $4) RETURNING *",
                [name, email, hashedPassword, contact]
            );
            const user = result.rows[0];

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

            res.cookie("jwt", token, {
                httpOnly: true,
                secure: true,
                sameSite: "Lax",
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });

            return res.status(201).json({ success: true, message: "Registration successful" });
        } catch (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Could not register the user." });
        }
    } catch (err) {
        console.error("Error during registration:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// User Login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: "User not found, sign up first." });
        }

        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
        
        if (!isValidPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.json({ success: true, message: "Successfully Authenticated" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Google OAuth Callback
export const googleAuthCallback = (req, res) => {

  if (!req.user) {
    return res.redirect("http://localhost:5173/login?error=Only%20IITI%20emails%20are%20allowed");
  }
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.redirect("http://localhost:5173/");
};

// Authenticate user based on the cookie sent which has jwt token 
export const getAuthenticatedUser = (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ id: decoded.id });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Logout User Route 
export const logoutUser = (req, res) => {
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "Lax" });
    res.json({ message: "Logged out" });
};

