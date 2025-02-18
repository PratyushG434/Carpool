import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Avatar,
    Box,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import { BsArrowRight } from "react-icons/bs"; // Aesthetic arrow
import { FaPhoneAlt } from "react-icons/fa";
import { isBefore } from "date-fns";
import { Rating } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

// Card to show all the upcoming rides of others 

const AllRidesCard = ({ ride, onRequest }) => {
    // Storing if the ride is past or future ride in flag to show details acccordingly

    const [dateTime] = useState(new Date(`${ride.date}T${ride.time}`));
    const now = new Date();
    const flag = isBefore(dateTime, now);
    console.log(flag);
    const [passengers, setPassengers] = useState(1);
    const isMobile = useMediaQuery("(max-width:450px)"); // Check if screen is mobile
    

    return (
        <Card
            sx={{
                backgroundColor: "#f0fff4",
                borderRadius: 3,
                boxShadow: 3,
                width: isMobile ? "90%" : 500, // Adjust width for mobile screens
                margin: "10px auto",
                padding: 3,
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
                    alignItems={isMobile ? "flex-start" : "center"}
                    mb={2}
                >
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#000",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            {ride.source}{" "}
                            <BsArrowRight
                                style={{ color: "#4ec38e", fontSize: 22, margin: "0 8px" }}
                            />{" "}
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
                            mt: isMobile ? 1 : 0, 
                        }}
                    >
                        {/* displaying ratings if past ride */}
                        {flag ? (
                            <Rating defaultValue={ride.ratings} readOnly />
                        ) : (
                            `${ride.seats_available} Seats left`
                        )}
                    </Box>
                </Box>

                {/* Creator Info */}
                <Box
                    display="flex"
                    flexDirection={isMobile ? "column" : "row"}
                    alignItems="center"
                    justifyContent="space-between"
                    mb={3}
                >
                    <Box display="flex" alignItems="center" mb={isMobile ? 2 : 0}>
                        <Avatar
                            sx={{
                                bgcolor: "#4ec38e",
                                width: 50,
                                height: 50,
                                fontSize: 18,
                                fontWeight: "bold",
                                mr: 2,
                            }}
                        >
                            {ride.creator.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography fontSize={16} fontWeight="bold" sx={{ color: "#000" }}>
                                Publisher : {ride.creator}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "#000", display: "flex", alignItems: "center" }}
                            >
                                <FaPhoneAlt style={{ marginRight: 5, color: "#4ec38e" }} />
                                {ride.contact}
                            </Typography>
                        </Box>
                    </Box>
                    {flag || (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                border: "1px solid #ccc",
                                borderRadius: "20px",
                                bgcolor: "white",
                                px: 1,
                                py: 0.5,
                                width: isMobile ? "100%" : "auto", // Full width for mobile
                            }}
                        >
                            <IconButton
                                color="success"
                                onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                            >
                                <Remove fontSize="small" />
                            </IconButton>
                            <Typography fontWeight="bold" mx={1}>
                                {passengers}
                            </Typography>
                            <IconButton
                                color="success"
                                onClick={() =>
                                    setPassengers((p) =>
                                        p < ride.seats_available ? p + 1 : p
                                    )
                                }
                            >
                                <Add fontSize="small" />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                {/* Price & Button */}
                <Box
                    display="flex"
                    flexDirection={isMobile ? "column" : "row"}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#000", mb: isMobile ? 2 : 0 }}
                    >
                        ₹{ride.price} / seat
                    </Typography>
                    {flag || (
                        <Button
                            variant="contained"
                            disabled={ride.requested}
                            sx={{
                                backgroundColor: "#4ec38e",
                                padding: "8px 16px",
                                fontSize: 14,
                                fontWeight: "bold",
                                borderRadius: "20px",
                                textTransform: "none",
                                "&:hover": { backgroundColor: "#3ba678" },
                                width: isMobile ? "100%" : "auto", // Full width on mobile
                            }}
                            onClick={() => onRequest(ride.id, passengers)}
                        >
                            {!ride.requested ? "Request ride" : "Requested"} { /* Show requested if the user has already requested for the ride*/}
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default AllRidesCard;