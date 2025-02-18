import React from "react";
import { Card, CardContent, Typography, Avatar, Box, useMediaQuery } from "@mui/material";
import { BsArrowRight } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";
import { Rating } from "@mui/material";

// showing past requests which are completed and rated by the user 

const MyPastPoolsCard = ({ req }) => {
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
              color: "#000",
              padding: "6px 14px",
              borderRadius: "15px",
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "center",
              whiteSpace: "nowrap",
              mt: isMobile ? 2 : 0
            }}
          >
            <Rating defaultValue={req.ratings} readOnly />
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

        {/* Price */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#000" }}>
            ₹{req.price} / seat
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MyPastPoolsCard;