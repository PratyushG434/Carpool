import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Box, useMediaQuery } from "@mui/material";
import { BsArrowRight } from "react-icons/bs"; 
import Rating from "@mui/material/Rating";
import { isBefore } from "date-fns";


// Card to show Rides created by the user till now 

const MyRideCard = ({ ride, onDelete }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [dateTime] = useState(new Date(`${ride.date}T${ride.time}`));
  const now = new Date();
  const flag = isBefore(dateTime, now); // Show ratings if ride is completed

  return (
    <Card
      sx={{
        backgroundColor: "#f0fff4",
        borderRadius: 3,
        boxShadow: 3,
        width: isMobile ? "90%" : 500,
        height: "auto",
        margin: "10px auto",
        padding: isMobile ? 2 : 3,
        transition: "0.2s",
        "&:hover": { transform: "scale(1.03)" },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "16px !important",
        }}
      >
        {/* Ride Details */}
        <Box>
          <Box 
            display="flex" 
            flexDirection={isMobile ? "column" : "row"} 
            justifyContent="space-between" 
            alignItems={isMobile ? "center" : "flex-start"} 
            mb={2}
            textAlign={isMobile ? "center" : "left"}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#000",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                {ride.source} 
                <BsArrowRight style={{ color: "#4ec38e", fontSize: 22, margin: "0 8px" }} /> 
                {ride.destination}
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
                mt: isMobile ? 2 : 0,
              }}
            >{/* Show ratings if its a past ride and show available rides if its future ride*/}
              {flag ? <Rating defaultValue={ride.ratings} readOnly size="small" /> : `${ride.seats_available} Seats left`}
            </Box>
          </Box>
        </Box>

        {/* Price & Button (At the bottom) */}
        <Box 
          display="flex" 
          flexDirection={isMobile ? "column" : "row"} 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            sx={{ color: "#000", mb: isMobile ? 1 : 0, textAlign: isMobile ? "center" : "left" }}
          >
            ₹{ride.price} / seat
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "red",
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: "bold",
              borderRadius: "20px",
              textTransform: "none",
              width: isMobile ? "100%" : "auto",
              "&:hover": { backgroundColor: "crimson" },
            }}
            onClick={() => onDelete(ride.id)}
          >
            Delete ride
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MyRideCard;