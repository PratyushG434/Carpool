import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Avatar, Box, Rating, useMediaQuery } from "@mui/material";
import { BsArrowRight } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";
import { isBefore } from "date-fns";

// Card to display the requests sent by the user to other rides 
const RequestsSentCard = ({ req, onWithdraw, onSubmit }) => {
  const [dateTime] = useState(new Date(`${req.date}T${req.time}`));
  const now = new Date();
  const flag = isBefore(dateTime, now);
  const [ratings, setRatings] = useState(0);
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Card
      sx={{
        backgroundColor: "#f0fff4",
        borderRadius: 3,
        boxShadow: 3,
        width: isMobile ? "90%" : 500,
        margin: "10px auto",
        padding: isMobile ? 2 : 3,
        transition: "0.2s",
        "&:hover": { transform: "scale(1.03)" },
      }}
    >
      <CardContent sx={{ padding: "16px !important" }}>
        {/* Ride Details */}
        <Box 
          display="flex" 
          flexDirection={isMobile ? "column" : "row"} 
          justifyContent="space-between" 
          alignItems={isMobile ? "center" : "flex-start"} 
          mb={2}
          textAlign={isMobile ? "center" : "left"}
        >
          <Box>
            <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start" }}>
              {req.source} <BsArrowRight style={{ color: "#4ec38e", fontSize: 22, margin: "0 8px" }} /> {req.destination}
            </Typography>
            <Typography variant="body2" sx={{ color: "#000" }}>
              {req.date} | {req.time}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#e0f2f1",
              padding: "6px 14px",
              borderRadius: "15px",
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "center",
              minWidth: 80,
              whiteSpace: "nowrap",
              mt: isMobile ? 2 : 0,
            }}
          >{/* taking uer ratings on completed rides */}
            {flag && req.status === "Accepted" ? (
              <Rating onChange={(event, newValue) => setRatings(newValue)} defaultValue={ratings} />
            ) : (
              `${req.passengers} Seats`
            )}
          </Box>
        </Box>

        {/* Creator Info */}
        <Box 
          display="flex" 
          flexDirection={isMobile ? "column" : "row"} 
          alignItems="center" 
          mb={2}
          textAlign={isMobile ? "center" : "left"}
        >
          <Avatar sx={{ bgcolor: "#4ec38e", width: 50, height: 50, fontSize: 18, fontWeight: "bold", mb: isMobile ? 1 : 0, mr: isMobile ? 0 : 2 }}>
            {req.creator.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontSize={16} fontWeight="bold" sx={{ color: "#000" }}>
              Publisher : {req.creator}
            </Typography>
            <Typography variant="body2" sx={{ color: "#000", display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start" }}>
              <FaPhoneAlt style={{ marginRight: 5, color: "#4ec38e" }} />
              {req.contact}
            </Typography>
          </Box>
        </Box>

        {/* Price & Buttons */}
        <Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#000", textAlign: isMobile ? "center" : "left" }}>
            ₹{req.price} / seat
          </Typography>
          {/* Dynamicallly showing the ride status or ratings option baseed on the ride status */}
          {req.status === "Pending" ? (
            <Button
              variant="contained"
              disabled={flag}
              sx={{
                backgroundColor: "#4ec38e",
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: "bold",
                borderRadius: "20px",
                textTransform: "none",
                mt: isMobile ? 2 : 0,
                width: isMobile ? "100%" : "auto",
                "&:hover": { backgroundColor: "#3ba678" },
              }}
              onClick={() => onWithdraw(req.id)}
            >
              Withdraw
            </Button>
          ) : (req.status === "Accepted" && flag)? (
            <Button
              variant="contained"
              disabled={ratings === 0}
              sx={{
                backgroundColor: "#4ec38e",
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: "bold",
                borderRadius: "20px",
                textTransform: "none",
                mt: isMobile ? 2 : 0,
                width: isMobile ? "100%" : "auto",
                "&:hover": { backgroundColor: "#3ba678" },
              }}
              onClick={() => onSubmit(req.id, ratings)}
            >
             Rate and Mark Done
            </Button>
          ) :(req.status ==="Accepted" && !flag)? (
            <Typography sx={{ color: "green", fontWeight: "bold", textAlign: "center", mt: isMobile ? 2 : 0 }}>
              Accepted
            </Typography>
          ):<Typography sx={{ color: "red", fontWeight: "bold", textAlign: "center", mt: isMobile ? 2 : 0 }}>
          Declined
        </Typography>
          }
        </Box>
      </CardContent>
    </Card>
  );
};

export default RequestsSentCard;