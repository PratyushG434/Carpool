import React,{useContext ,useState} from 'react';
import axios from 'axios';
import Navigation from "../components/Navigation";
import RidesCard from "../components/RidesCard";
import { AuthContext } from "../components/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';


const Rides = () => {
    // using Auth context to get user 
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.state);
    const [rides, setRides] = useState(location.state?.rides || rides_test);

    const handleRequest = async (rideId) => {

        if(!user)
        {
            navigate('/login');
            return;
        }
        
        // Sending request for a ride 
        try {
            const res = await axios.post('http://localhost:3000/requests/send', {
                rideId : rideId,
                passengers : location.state.passengers,
                userId : user.id,
            });
            
            alert(res.data.message);

            //  Remove the requested ride from the list
            setRides((prevRides) => prevRides.filter((ride) => ride.id !== rideId));
            
            console.log("Ride request response:", res.data);
        } catch (err) {
            console.error("Error sending ride request:", err);
            alert("Could not send request.");
        }
    };

    return (
        <>
            <Navigation /> 
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", padding: "20px" }}> 
                {(rides.length!==0)?rides.map((ride) => (
                    <RidesCard key={ride.id} ride={ride} onRequest={handleRequest} />
                )):
                <div className="fullImageContainer">
                        <p style={{textAlign:"center", width:"100%"}}>No Pending Requests</p>
                        <img src="../../NoMatches.jpg" alt="" />
                    </div>
                } 
            </div>
        </>
    );
};

export default Rides;