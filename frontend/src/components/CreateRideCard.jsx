import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Box,
  Stack,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Add, Remove, SwapHoriz, PeopleOutline } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { addDays } from "date-fns";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Custom Theme
const theme = createTheme({
  palette: {
    primary: { main: "#4ec38e" },
    secondary: { main: "#3c9a6f" },
  },
});

const CreateRide = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Single useState for form data
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    seats: 2,
    date: addDays(new Date(), 1),
    time: new Date(),
    contact: "",
    price: "",
  });
// function for swapping locations in the form 
  const swapLocations = () => {
    setFormData((prev) => ({
      ...prev,
      source: prev.destination,
      destination: prev.source,
    }));
  };


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // handling form submission 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }


    const formattedDate = formData.date.toISOString().split("T")[0];  
    const formatTo24Hour = (time) => {
      const hours = String(time.getHours()).padStart(2, '0'); // 24-hour format
      const minutes = String(time.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}:00`;
    };         

    // making req to backend to create ride
    try {
      const res = await axios.post("http://localhost:3000/rides/create", {
        creator_id: user.id,
        source: formData.source,
        destination: formData.destination,
        date: formattedDate,
        time: formatTo24Hour(formData.time),
        contact: formData.contact,
        seats: formData.seats,
        price: formData.price
      });

      alert(res.data.message);

      // Reset form after submission
      setFormData({
        source: "",
        destination: "",
        seats: 2,
        date: addDays(new Date(), 1),
        time: new Date(),
        contact: "",
        price:""
      });

    } catch (err) {
      alert("Error creating ride.");
      console.error(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          width: "90%",
          maxWidth: 430,
          mx: "auto",
          p: 2,
          borderRadius: "20px",
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              <span>{formData.seats} Spare Seats</span>
            </Box>
            <Box>
              <IconButton color="secondary" onClick={() => setFormData((prev) => ({ ...prev, seats: Math.max(1, prev.seats - 1) }))}>
                <Remove />
              </IconButton>
              <IconButton color="secondary" onClick={() => setFormData((prev) => ({ ...prev, seats: prev.seats + 1 }))}>
                <Add />
              </IconButton>
            </Box>
          </Box>

          {/* Date & Time Pickers */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction="row" spacing={2}>
              <DatePicker
                value={formData.date}
                onChange={(newDate) => setFormData((prev) => ({ ...prev, date: newDate }))}
                shouldDisableDate={(date) => date < new Date()}
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

              <TimePicker
                value={formData.time}
                onChange={(newTime) => setFormData((prev) => ({ ...prev, time: newTime }))}
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
            </Stack>
          </LocalizationProvider>

          {/* Contact Input */}
          <TextField
            fullWidth
            variant="outlined"
            name="contact"
            placeholder="Enter your contact"
            value={formData.contact}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
          />

          {/* Price Input */}
          <TextField
            fullWidth
            variant="outlined"
            name="price"
            placeholder="Enter price per seat"
            value={formData.price}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
          />

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            disableElevation
            onClick={handleSubmit}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              borderRadius: "50px",
              textTransform: "none",
              fontWeight: "bold",
              height: "50px",
              "&:hover": { bgcolor: "secondary.main" },
            }}
          >
            Create Ride
          </Button>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default CreateRide;