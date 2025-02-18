import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from "../components/Navigation";
import MyPastPoolsCard from "../components/MyPastPoolsCard";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from 'react-router-dom';


// Listing rides of which the user has been a part of in the past 

const MyPastPools = () => {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    var [pools, setPools] = useState([]);
  
    // Updates whenever the user changes or page changes 
    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        // Fetching the requests made by user which are completed 
        const fetchRequests = async () => {
            try {
                const res = await axios.get("http://localhost:3000/requests/sent", {
                    params: { userId: user?.id , completed:"true"}, // Use params for GET request
                });
                 
                 if(res.data.success)
                setPools(res.data.data || []); // Assuming API returns ride data
                 else
                       alert(res.data.message);
            } catch (err) {
                console.error("Error fetching ride requests:", err);
                alert("Failed to load pools");
            }
        };

        fetchRequests();
    }, [user, navigate]); // Runs when user changes


    return (
        <>
            <Navigation />
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
                {pools.length!==0?pools.map((pool) => (
                    <MyPastPoolsCard key={pool.id} req={pool}/>
                )):
                <div className="fullImageContainer">
                        <p style={{textAlign:"center", width:"100%"}}>No Past Rides</p>
                        <img src="../../NoItems.jpg" alt="" />
                    </div>
                }
            </div>
        </>
    );
};

export default MyPastPools;

