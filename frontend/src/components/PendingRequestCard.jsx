import React from "react";
import { Card, CardContent, Typography, Button, Avatar, Box, useMediaQuery } from "@mui/material";
import { BsArrowRight } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";

// Card to show requests sent by the user to other rides 

const PendingRequestCard = ({ req, onResponse }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Card
      sx={{
        backgroundColor: "#f0fff4",
        borderRadius: 3,
        boxShadow: 3,
        width: isMobile ? "90%" : 450,
        margin: "10px auto",
        padding: isMobile ? 2 : 3,
        transition: "0.2s",
        "&:hover": { transform: "scale(1.03)" },
      }}
    >
      <CardContent sx={{ padding: "16px !important" }}>
        {/* Request Details */}
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
              sx={{ color: "#000", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start" }}
            >
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
              mt: isMobile ? 2 : 0,
            }}
          >
            {req.passengers} Passengers
          </Box>
        </Box>

        {/* User Info */}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          alignItems="center"
          mb={2}
          textAlign={isMobile ? "center" : "left"}
        >
          <Avatar
            sx={{
              bgcolor: "#4ec38e",
              width: 50,
              height: 50,
              fontSize: 18,
              fontWeight: "bold",
              mb: isMobile ? 1 : 0,
              mr: isMobile ? 0 : 2
            }}
          >
            {req.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontSize={16} fontWeight="bold" sx={{ color: "#000" }}>
              Sent By : {req.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#000", display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start" }}>
              <FaPhoneAlt style={{ marginRight: 5, color: "#4ec38e" }} />
              {req.contact}
            </Typography>
            <Typography variant="body2" sx={{ color: "#000", display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start" }}>

              {req.remarks}
            </Typography>
          </Box>
        </Box>

        {/* Dynamically showing Buttons  or request status based on whether its a past request or pending request or declined or accepted req*/}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            sx={{
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: "bold",
              borderRadius: "20px",
              textTransform: "none",
              backgroundColor: "red",
              "&:hover": { backgroundColor: "crimson" },
              width: isMobile ? "100%" : "auto",
              mb: isMobile ? 1 : 0
            }}
            onClick={() => onResponse(req.id, "Declined", 0)}
          >
            Decline
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4ec38e",
              padding: "8px 25px",
              fontSize: 14,
              fontWeight: "bold",
              borderRadius: "20px",
              textTransform: "none",
              width: isMobile ? "100%" : "auto",
              "&:hover": { backgroundColor: "#3ba678" },
            }}
            onClick={() => onResponse(req.id, "Accepted", req.seats_available - req.passengers)}
          >
            Accept
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PendingRequestCard;