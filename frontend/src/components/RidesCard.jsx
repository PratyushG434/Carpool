import React from "react";
import { Card, CardContent, Typography, Button, Avatar, Box } from "@mui/material";
import { BsArrowRight } from "react-icons/bs";  // Aesthetic arrow
import { FaPhoneAlt } from "react-icons/fa";

// Card to show the available rides when user searches for a ride 

const RideCard = ({ ride, onRequest }) => {
  return (
    <Card
      sx={{
        backgroundColor: "#f0fff4",
        borderRadius: 3,
        boxShadow: 3,
        width: 500, 
        margin: "10px auto",
        padding: 3,
        transition: "0.2s",
        "&:hover": { transform: "scale(1.03)" },
      }}
    >
      <CardContent sx={{ padding: "16px !important" }}>
        {/* Ride Details */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold", display: "flex", alignItems: "center" }}>
              {ride.source} <BsArrowRight style={{ color: "#4ec38e", fontSize: 22, margin: "0 8px" }} /> {ride.destination}
            </Typography>
            <Typography variant="body2" sx={{ color: "#000" }}>
              {ride.date} | {ride.time}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#e0f2f1",
              color: "#000",
              padding: "6px 14px",
              borderRadius: "15px",
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {ride.seats_available} Seats left
          </Box>
        </Box>

        {/* Creator Info */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: "#4ec38e", width: 50, height: 50, fontSize: 18, fontWeight: "bold", mr: 2 }}>
            {ride.creator.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontSize={16} fontWeight="bold" sx={{ color: "#000" }}>
              {ride.creator}
            </Typography>
            <Typography variant="body2" sx={{ color: "#000", display: "flex", alignItems: "center" }}>
              <FaPhoneAlt style={{ marginRight: 5, color: "#4ec38e" }} />
              {ride.contact}
            </Typography>
          </Box>
        </Box>

        {/* Price & Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#000" }}>
            ₹{ride.price} / seat
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4ec38e",
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: "bold",
              borderRadius: "20px",
              textTransform: "none", 
              "&:hover": { backgroundColor: "#3ba678" },
            }}
            onClick={() => onRequest(ride.id)}
          >
            Request ride
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RideCard;