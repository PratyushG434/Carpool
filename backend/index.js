import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';  
import pool from './config/db.js';

dotenv.config();
const app = express();
const port = 3000;


// Pinging the db regularly to prevent it form sleeping
setInterval(async () => {
    console.log("hello");
  try {
      const res = await pool.query('SELECT * FROM users');
      console.log('Database kept alive',res.rows);
  } catch (err) {
      console.error('Database ping failed:', err);
  }
}, 1800000); 


// middlewares to parse url encoded and json data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


// using cookie parser middleware for sending jwt token to the frontend during login and verifying it to keep the user logged in 
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173", 
        credentials: true, // Allow cookies to be sent
    })
);


// Routes
app.use('/auth', authRoutes);
app.use('/rides', rideRoutes);
app.use('/requests', requestRoutes);



app.listen(port, () => {
    console.log('Server running at http://localhost:'+port);
});

