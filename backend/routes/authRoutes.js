import express from "express";
import dotenv from "dotenv";
import passport from "../config/auth.js";
import * as authControllers from '../controllers/authController.js';

dotenv.config();
const router = express.Router();

// Manual Auth routes
router.post("/register", authControllers.registerUser);
router.post("/login", authControllers.loginUser);

// Route to authenticate user with cookie sent in the request 
router.get("/me", authControllers.getAuthenticatedUser);

//Logout route to delete the user info cookie
router.post("/logout", authControllers.logoutUser);
 

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/auth/google/failure"}), authControllers.googleAuthCallback);

// Google login failure route
router.get("/google/failure", (req, res) => {
    res.redirect("http://localhost:5173/signup?error=Only%20IITI%20emails%20are%20allowed");
  });


export default router;