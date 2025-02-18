import Badge from "@mui/material/Badge";
import PendingIcon from "@mui/icons-material/Pending"; // Pending icon
import IconButton from "@mui/material/IconButton";
import { useEffect, useState ,useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axios from 'axios';

// Badge icon to show pending requests number in the navigation bar 

export default function RideRequestsBadge() {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [requests,setRequests] = useState(0);
  useEffect(() => {
    if (!user) {
        navigate("/login");
        return;
    }
// fetch requests received by the user to show its number  using useEffect hook which runs on every change in user or every path change 
    const fetchRequests = async () => {
        try {
            const res = await axios.get("http://localhost:3000/requests/received", {
                params: { userId: user?.id }, // Use params for GET request
            });
          if(res.data.success)
            setRequests(res.data.data.length); 
           else
             alert(res.data.message);

        } catch (err) {
            console.error("Error fetching ride requests:", err);
            alert("Failed to load requests");
        }
    };

    fetchRequests();

}, [user, navigate]); // Runs when user changes

  return (
    <IconButton color="primary">
       <Badge
        badgeContent={requests}
        color="error"
        
      >
        <PendingIcon fontSize="small" color="success" />
      </Badge>
    </IconButton>
  );
}