import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from "../components/Navigation";
import RequestsSentCard from "../components/RequestsSentCard";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from 'react-router-dom';


// Requests Sent page 

const RequestsSent = () => {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    var [requests, setRequests] = useState([]);
    console.log(user);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        // Fetching rides to whom req is sent 
        const fetchRequests = async () => {
            try {
                const res = await axios.get("http://localhost:3000/requests/sent", {
                    params: { userId: user?.id , completed:"false"}, // Use params for GET request
                });
                   
                   if(res.data.success)
                setRequests(res.data.data || [] ); // Assuming API returns ride data
                 else 
                     alert(res.data.message)
    
    } catch (err) {
                console.error("Error fetching ride requests:", err);
                alert("Failed to load requests");
            }
        };

        fetchRequests();
    }, [user, navigate]); // Runs when user changes

    const handleSubmit = async (reqId, ratings) => {
        if(!user)
            navigate('/login');
        // Submitting the ratings for the ride 
        try {
            const res = await axios.post(`http://localhost:3000/requests/ratings/${reqId}`, { ratings });

            alert(res.data.message); 
            if(res.data.success)
                setRequests((prevRequests) => prevRequests.filter(req => req.id !== reqId));
        } catch (err) {
            alert(err.response?.data?.message || "Could not submit ratings at the moment");
            return;
        }

    };
    // Handling withdraw req 
    const handleWithdraw = async (reqId) => {
        if(!user)
            navigate('/login');
        try {
            // Withdrawing the request 
            const res = await axios.delete(`http://localhost:3000/requests/delete/${reqId}`, {data:{userId: user.id}});

            alert(res.data.message); 
            if(res.data.success)
            setRequests((prevRequests) => prevRequests.filter(req => req.id !== reqId));
        } catch (err) {
            alert(err.response?.data?.message || "Could not withdraw request at the moment");
            return;
        }
    };



    return (
        <>
            <Navigation />
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
                {(requests.length!==0) ? requests.map((request) => (
                    <RequestsSentCard key={request.id} req={request} onWithdraw={handleWithdraw} onSubmit={handleSubmit} />
                )):<div className="fullImageContainer">
                <p style={{textAlign:"center", width:"100%"}}>No Requests Found</p>
                <img src="../../NoItems.jpg" alt="" />
            </div>}
            </div>
        </>
    );
};

export default RequestsSent;

