import pool from '../config/db.js';


// Create ride route 

export async function createRide (req, res) 
{
    const { creator_id, seats, date, time, source, destination, contact , price} = req.body;

    try {
        // Fetch creator's name
        const userResult = await pool.query("SELECT name FROM users WHERE id = $1", [creator_id]);

        // Check if the user exists
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const creator = userResult.rows[0].name;

        // Insert ride into the database
        const rideResult = await pool.query(
            "INSERT INTO rides (creator, creator_id , seats_available, date, time, source, destination, contact, price) VALUES ($1, $2, $3, $4, $5, $6, $7 , $8, $9) ",
            [creator, creator_id , seats, date, time, source, destination, contact,price]
        );
        
        // 
        return res.status(201).json({
            success:true,
            message: "Ride created successfully",
        });

    } catch (err) {
        console.error("Error creating ride:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};


// Search Ride route for fetching existing rides 

export async function searchRide(req, res) {
    try {
        const { date, source, destination, passengers , userId } = req.query;
        console.log(date, source, destination, passengers , userId);
        var result;

        // If there is a user then send only those rides which are not already requested by him
        if(userId && source)
        {
            console.log(userId);
            result = await pool.query("SELECT rides.* FROM rides LEFT JOIN requests ON rides.id = requests.ride_id AND requests.user_id = $5 WHERE rides.date = $1 AND rides.source = $2 AND rides.destination = $3 AND rides.seats_available >= $4 AND rides.creator_id <> $5 AND requests.ride_id IS NULL",[date, source, destination, passengers,userId]);
            
        }
        // If no user send rides according to only the defined parameters
        else if(source)
        {
          result = await pool.query("SELECT * FROM rides WHERE date = $1 AND source = $2 AND destination = $3 AND seats_available >= $4",[date, source, destination, passengers]);
        }
        // If neither a user nor parameters send all rides
        else 
        {
             result = await pool.query("SELECT r.*, (req.user_id IS NOT NULL) AS requested FROM rides r LEFT JOIN requests req ON r.id = req.ride_id AND req.user_id = $1 WHERE r.creator_id <> $1",[userId]);
        }

        // Check if rides are available
        if (result.rows.length === 0) {
            return res.status(200).json({ sucess:true, message: "No rides available for the given criteria" });
        }

        return res.status(200).json({ success: true, rides: result.rows });
    } catch (err) {
        console.error("Error searching for rides:", err);
        return res.status(500).json({ success:false , message: "Internal Server Error" });
    }
};



// Route to fetch user created rides 

export async function createdRides (req, res) {
    const { userId } = req.query;

    // Checking the user is logged in 
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }
  
    try {
        const result = await pool.query("SELECT * FROM rides WHERE creator_id = $1", [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: true, message: "No rides found for this user" });
        }
        console.log(result.rows);
        res.status(200).json({ 
            success: true,
            rides: result.rows 
        });
    } catch (err) {
        console.error("Error fetching rides:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Route to delete created rides 

export async function deleteRide  (req, res) {
    const { id } = req.params;  // Ride ID from URL
    const { userId } = req.query; // User ID from query params
    
    if (!id || !userId) {
        return res.status(400).json({ success: false, message: "Ride ID and User ID are required" });
    }
    
    try {
        // Ensure the user is deleting their own ride
        const ride = await pool.query("SELECT * FROM rides WHERE id = $1 AND creator_id = $2", [id, userId]);
        
        if (ride.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Ride not found or unauthorized" });
        }
        
        // Delete the ride
        const result = await pool.query("DELETE FROM rides WHERE id = $1", [id]);
        
        res.status(200).json({ 
            success: true, 
            message: "Ride deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting ride:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



