import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from "../components/Navigation";
import RequestCard from "../components/PendingRequestCard";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from 'react-router-dom';



const PendingRequests = () => {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    var [requests, setRequests] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchRequests = async () => {
            try {
                // Fetching pending requests 
                const res = await axios.get("http://localhost:3000/requests/received", {
                    params: { userId: user?.id }, // Use params for GET request
                });
              if(res.data.success)
                setRequests(res.data.data); // Assuming API returns ride data
               else
                 alert(res.data.message);

            } catch (err) {
                console.error("Error fetching ride requests:", err);
                alert("Failed to load requests");
            }
        };

        fetchRequests();
    }, [user, navigate]); // Runs when user changes


    const handleResponse = async (reqId, value, seatsLeft) => {

        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const res = await axios.put(`http://localhost:3000/requests/${reqId}`, {
                status: value,
                seatsLeft: seatsLeft
            });

            alert(res.data.message);

            // Remove the approved or declined ride from the list
            setRequests((prevReq) => prevReq.filter((req) => req.id !== reqId));
            console.log("Ride request response:", res.data);

        } catch (err) {
            console.error("Error sending ride request:", err);
        
        }
    };



    return (
        <>
            <Navigation />
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
                {requests.length !== 0 ? (
                    requests.map((request) => (
                        <RequestCard key={request.id} req={request} onResponse={handleResponse} />
                    ))
                ) : (
                    <div className="fullImageContainer">
                        <p style={{textAlign:"center", width:"100%"}}>No Pending Requests</p>
                        <img src="../../NoItems.jpg" alt=""/>
                    </div>
                )}
            </div>
        </>
    );
};

export default PendingRequests;

