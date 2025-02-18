import React, { useState ,useContext} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    Card,
    CardContent,
    Button,
    TextField,
    IconButton,
    Box,
    createTheme,
    ThemeProvider,
} from "@mui/material";
import { Add, Remove, SwapHoriz, PeopleOutline } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { addDays } from "date-fns";
import { AuthContext } from "./AuthContext";

// Custom Theme
const theme = createTheme({
    palette: {
        primary: { main: "#4ec38e" },
        secondary: { main: "#3c9a6f" },
    },
});

// Card to search for rides by giving source , destination and date 

const SearchCard = () => {
    const {user} = useContext(AuthContext);
    const [formData, setFormData] = useState({
        source: "",
        destination: "",
        passengers: 2,
        date: addDays(new Date(), 1),
        
    });
    const [flag, setFlag] = useState(true); // Indicates whether rides are available
    const navigate = useNavigate();

    // Handling input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handling date change separately since DatePicker returns a date object
    const handleDateChange = (newDate) => {
        setFormData((prev) => ({ ...prev, date: newDate }));
    };

    // Handling form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedDate = formData.date.toISOString().split("T")[0]; 
          
        try {
            const res = await axios.get('http://localhost:3000/rides/search', { params: {...formData,date:formattedDate,userId:user.id}});

            if (res.data.success) {
                console.log("yes");
                setFlag(true);
                navigate("/rides", { state: { rides: res.data.rides, passengers: formData.passengers } });
            } else {
                setFlag(false);
                console.log("no");
                
            }
        } catch (err) {
            alert("Couldn't search for rides");
        }
    };

    // Swapping locations
    const swapLocations = () => {
        setFormData((prev) => ({
            ...prev,
            source: prev.destination,
            destination: prev.source,
        }));
    };

    return (
        <ThemeProvider theme={theme}>
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    mx: "auto",
                    p: 2,
                    borderRadius: "20px",
                    boxShadow: 3,
                }}
            >
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {/* No rides found message */}
                    {!flag && <p>Sorry !! No Rides Found for the given preferences.</p>}

                    {/* Source Input */}
                    <TextField
                        fullWidth
                        variant="outlined"
                        name="source"
                        value={formData.source}
                        placeholder="Leaving from"
                        onChange={handleChange}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
                    />

                    {/* Swap Icon */}
                    <IconButton sx={{ float: "right", color: "secondary.main" }} onClick={swapLocations}>
                        <SwapHoriz />
                    </IconButton>

                    {/* Destination Input */}
                    <TextField
                        fullWidth
                        variant="outlined"
                        name="destination"
                        value={formData.destination}
                        placeholder="Going to"
                        onChange={handleChange}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
                    />

                    {/* Passenger Selection */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: "1px solid #ccc",
                            borderRadius: "20px",
                            padding: "10px",
                            width: "100%",
                            bgcolor: "background.paper",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <PeopleOutline sx={{ mr: 1, color: "grey.700" }} />
                            <span>{formData.passengers} Passengers</span>
                        </Box>
                        <Box>
                            <IconButton
                                color="secondary"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        passengers: Math.max(1, prev.passengers - 1),
                                    }))
                                }
                            >
                                <Remove />
                            </IconButton>
                            <IconButton
                                color="secondary"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        passengers: prev.passengers + 1,
                                    }))
                                }
                            >
                                <Add />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Date Picker */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={formData.date}
                            onChange={handleDateChange}
                            shouldDisableDate={(date) => date < addDays(new Date(), 0)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": { borderRadius: "20px", bgcolor: "background.paper" },
                                        "& .MuiInputBase-root": { borderRadius: "20px" },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>

                    {/* Search Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        disableElevation
                        sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            borderRadius: "50px",
                            textTransform: "none",
                            fontWeight: "bold",
                            height: "50px",
                            fontSize: "1rem",
                            "&:hover": { bgcolor: "secondary.main" },
                        }}
                        onClick={handleSubmit}
                    >
                        Search Rides
                    </Button>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};

export default SearchCard;