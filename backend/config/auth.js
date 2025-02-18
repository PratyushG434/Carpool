import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./db.js";
import dotenv from "dotenv";

dotenv.config();



// Google OAuth Strategy Setup inserting the user if he is not signed up and verifying if already logged in 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {


        const email = profile.emails[0].value;

        // Check if the email belongs to IIT Indore
        if (!email.endsWith("@iiti.ac.in")) {
          return done(null, false, { message: "Only IITI emails are allowed." });
        }

        const existingUser = await pool.query("SELECT * FROM users WHERE google_id = $1", [profile.id]);



        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }

        const newUser = await pool.query(
          "INSERT INTO users (name, email, google_id, contact) VALUES ($1, $2, $3, COALESCE($4, '')) RETURNING *",
          [profile.displayName, profile.emails[0].value, profile.id, profile.contactNumber || null]
        );

        return done(null, newUser.rows[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, user.rows[0]);
  } catch (err) {
    done(err, null);
}});

export default passport;