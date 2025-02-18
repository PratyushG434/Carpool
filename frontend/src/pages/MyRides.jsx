import React,{useContext ,useState , useEffect} from 'react';
import axios from 'axios';
import Navigation from "../components/Navigation";
import MyRideCard from "../components/MyRideCard";
import { AuthContext } from "../components/AuthContext";
import { useNavigate} from 'react-router-dom';

// Listing the rides created by the user 

const MyRides = () => {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    var [rides, setRides] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        // Fetching the rides created by the user  
        const fetchRides = async () => {
            try {
                const res = await axios.get("http://localhost:3000/rides/created", {
                    params: { userId: user?.id }, 
                });
              
                if(res.data.success)
                setRides(res.data.rides||[] );
                else 
                alert(res.data.message);
            } catch (err) {
                console.error("Error fetching ride rides:", err);
          
            }
        };

        fetchRides();
    }, [user, navigate]); // Runs when user changes
    
    // Handling the delete req for a ride 
    const handleDelete = async (rideId) => {
        if(!user)
            navigate('/login');
        let confirmation = confirm(`Do you want to delete this ride?`);

        if(confirmation){
        try {
            // Hitting the delete route to delete the req 
            const res = await axios.delete(`http://localhost:3000/rides/delete/${rideId}`, {params:{
                userId : user?.id}});
            alert(res.data.message);
            if(res.data.success)
                setRides((prevRides) => prevRides.filter(ride => ride.id !== rideId));

            console.log("Ride request response:", res.data.message);
        } catch (err) {
            console.error("Error sending ride request:", err);
            alert("Error deleting ride. Try again later.");
        }
    }
    }
    return (
        <>
            <Navigation /> 
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", padding: "20px" }}> 
                {rides.length!==0?rides.map((ride) => (
                    <MyRideCard key={ride.id} ride={ride} onDelete={handleDelete} />
                )):
                <div className="fullImageContainer">
                <p style={{textAlign:"center", width:"100%"}}>No Rides Created</p>
                <img src="../../NotFound.jpg" alt=""/>
            </div>
                } 
            </div>
        </>
    );
};

export default MyRides;