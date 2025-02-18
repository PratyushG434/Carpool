import pool from '../config/db.js';


// Route to send ride sharing request 


export const requestRide = async (req, res) => {
    const { rideId, userId, passengers } = req.body;
    try {
        // Insert ride request into the database
        const result = await pool.query(
            "INSERT INTO requests (ride_id, user_id, passengers, status) VALUES ($1, $2, $3, $4) RETURNING *",
            [rideId, userId, passengers, "Pending"]
        );

        return res.status(201).json({
            success:true,
            message: "Ride request submitted successfully"
        });
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ success:false , message: "Internal Server Error" });
    }
};

// Fetching requests sent to the user by other individuals on rides created by him 

export const getReceivedRequests = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        const result = await pool.query(
            "SELECT requests.id, rides.seats_available, users.name, rides.source, rides.destination, rides.date, rides.time, users.contact, requests.passengers FROM requests INNER JOIN rides ON rides.id = requests.ride_id INNER JOIN users ON users.id = requests.user_id WHERE rides.creator_id = $1 AND requests.status=$2",
            [userId,"Pending"]
        );

        return res.status(200).json({ success: true, data: result.rows});
    } catch (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Fetch the requests made by the user to rides created by others till now 

export const getSentRequests = async (req, res) => {
    const { userId , completed } = req.query;
   
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        var result;   // completed is used to distinguish between (upcoming or pending) requests and the past completed requests which are already rated by the user
        if(completed==="true"){
       
           result = await pool.query(
            "SELECT requests.id , rides.creator, rides.source, rides.destination, rides.date , rides.time , rides.contact , requests.passengers , requests.status , requests.user_ratings ,rides.ratings, rides.price FROM requests INNER JOIN rides ON rides.id = requests.ride_id INNER JOIN users ON users.id = requests.user_id WHERE requests.user_id = $1 AND user_ratings > $2",
            [userId,0]
        );
        }
        else{
            console.log(userId);
        result = await pool.query(
            "SELECT requests.id , rides.creator, rides.source, rides.destination, rides.date , rides.time , rides.contact , requests.passengers , requests.status , requests.user_ratings , rides.price FROM requests INNER JOIN rides ON rides.id = requests.ride_id INNER JOIN users ON users.id = requests.user_id WHERE requests.user_id = $1 AND user_ratings = $2",
            [userId,0]
        );
    }
        if(result.rows.length==0)
        {
            console.log("er");
            return res.status(200).json({ success: true, message: "No requests sent" });
        }

        return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Answer the ride requests received 

export const answerRequest = async (req, res) => {
    const { status , seatsLeft} = req.body; // Ensure `status` is also provided
    const { reqId } = req.params;
    if (!reqId || !status) {
        return res.status(400).json({ message: "Missing requestId or status" });
    }

    try {
        const result = await pool.query(
            "UPDATE requests SET status = $1 WHERE id = $2 RETURNING *",
            [status, reqId]
        );



        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        const result_ = await pool.query(
            "UPDATE rides SET  seats_available = $1 WHERE id = $2",
            [seatsLeft,reqId]
        );

        return res.status(200).json({
            message: `Ride request ${status}`
        });

    } catch (err) {
        console.error("Error updating ride request:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// Delete the request sent for a ride 


export const deleteRequest = async (req, res) => {
    const { id } = req.params;  // Req ID from URL
    const userId = req.body.userId;
    console.log(userId);
    if (!id ) {
        return res.status(400).json({ success: false, message: "Req ID is required" });
    }

    try {
        // Ensure the user is deleting their own req
        const request = await pool.query("SELECT * FROM requests WHERE id = $1 AND user_id = $2", [id, userId]);

        if (request.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Request not found or unauthorized" });
        }

        // Delete the req
        const result = await pool.query("DELETE FROM requests WHERE id = $1", [id]);

        res.status(200).json({ 
            success: true, 
            message: "Request withdrawn successfully", 
            
        });
    } catch (err) {
        console.error("Error deleting request:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Give ratings to the past shared rides 

export const giveRatings = async (req, res) => {
    const { ratings } = req.body;
    const { reqId } = req.params;

    if (!reqId || ratings === undefined) {
        return res.status(400).json({ message: "Missing request ID or ratings" });
    }

    try {
        // Update the user_ratings for the specific request
        const updateRequest = await pool.query(
            "UPDATE requests SET user_ratings = $1 WHERE id = $2 RETURNING *",
            [ratings, reqId]
        );

        if (updateRequest.rowCount === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Get the ride_id from the updated request
        const rideId = updateRequest.rows[0].ride_id;

        // Calculate the average user_ratings for the given ride_id
        const avgRatingsResult = await pool.query(
            "SELECT COALESCE(ROUND(AVG(NULLIF(user_ratings, 0))), 0) AS avg_ratings FROM requests WHERE ride_id = $1;",
            [rideId]
        );

        const avgRatings = avgRatingsResult.rows[0].avg_ratings || 0;

        // Update the ratings column in rides table
        await pool.query(
            "UPDATE rides SET ratings = $1 WHERE id = $2",
            [avgRatings, rideId]
        );

        return res.status(200).json({success:true, message: "Ratings updated successfully" });

    } catch (err) {
        console.error("Error updating ratings:", err);
        return res.status(500).json({ success: false,message: "Internal Server Error" });
    }
};