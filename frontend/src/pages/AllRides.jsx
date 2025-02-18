import React,{useContext ,useEffect,useState} from 'react';
import axios from 'axios';
import Navigation from "../components/Navigation";
import AllRidesCard from "../components/AllRidesCard";
import { AuthContext } from "../components/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';

// All rides created by others

const Rides = () => {
    
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [rides, setRides] = useState([]);
   

    
    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        // Fetching  all rides 
        const fetchRequests = async () => {
            try {
                const res = await axios.get("http://localhost:3000/rides/search", {
                    params: { userId: user?.id }, // Use params for GET request
                });
                 if(res.data.success)
                setRides(res.data.rides || []); // Assuming API returns ride data
                 else 
                 setRides();

            } catch (err) {
                console.error("Error fetching rides:", err);
                alert("Failed to load rides");
            }
        };

        fetchRequests();
    }, [user, navigate]); // Runs when user changes

    // handling the send reuquest for a ride 
    const handleRequest = async (rideId,passengers) => {
        console.log(passengers);
        if (!user) {
            navigate('/login');
            return;
        }
    
        try {
            const res = await axios.post('http://localhost:3000/requests/send', {
                rideId: rideId,
                passengers: passengers,
                userId: user.id,
            });
    
            
            // listing rides if fetching is successful 
            if(res.data.success)
            setRides((prevRides) =>
                prevRides.map((ride) =>
                    ride.id === rideId ? { ...ride, requested : true} : ride
                )
            );
            else 
            {
                alert(res.data.message);

            }
    
            console.log("Ride request response:", res.data);
        } catch (err) {
            console.error("Error sending ride request:", err);
        }
    };
    return (
        <>
            <Navigation /> 
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", padding: "20px" }}> 
                {rides.length!==0?rides.map((ride) => (
                    <AllRidesCard key={ride.id} ride={ride} onRequest={handleRequest} />
                )):
                <div className="fullImageContainer">
                        <p style={{textAlign:"center", width:"100%"}}>No rides found</p>
                        <img src="../../NotFound.jpg" alt="" />
                    </div>
                } 
            </div>
        </>
    );
};

export default Rides;