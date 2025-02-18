import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import {
    Card,
    CardContent,
    Button,
    TextField,
    Typography,
    createTheme,
    ThemeProvider,
    Divider
} from "@mui/material";
import axios from "axios"; // Import axios

const backendUrl = "http://localhost:3000";

// Custom Theme
const theme = createTheme({
    palette: {
        primary: { main: "#4ec38e" },
        secondary: { main: "#3c9a6f" },
    },
});

// Login Card component 
const LoginCard = () => {
    const [formData, setFormData] = useState({ email: "", password: ""});
    const [error,setError] = useState("");
    const navigate = useNavigate();

    const { fetchUser } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handling submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation: Check if any field is empty
        if (!formData.email || !formData.password) {
            setError("All fields are required.");
            return;
        }

       // hitting login route
        try {
                const response = await axios.post("http://localhost:3000/auth/login", formData , {withCredentials:true});
                alert(response.data.message);
                if(response.data.success){
                    console.log("done");
                   fetchUser();
                   navigate('/');
                }
            } catch (err) {
                setError(err.response?.data?.message || "Login failed.");
            }
        };
    

    // handling google login 
      const handleGoogleLogin = () => {
        window.location.href = "http://localhost:3000/auth/google";
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
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center", alignItems:"center" }}>
                    {/* Title */}
          
                        <h4>Welcome Back to Carpool</h4>
                  

                    {/* Email Input */}
                    <TextField
                        fullWidth
                        variant="outlined"
                        name="email"
                        value={formData.email}
                        placeholder="Enter your institute email ID"
                        onChange={handleChange}
                        error={!formData.email && error}
                        helperText={!formData.email && error ? "Email is required" : ""}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
                    />

                   
                    {/* Password Input */}
                    <TextField
                        fullWidth
                        variant="outlined"
                        name="password"
                        type="password"
                        value={formData.password}
                        placeholder="Enter password"
                        onChange={handleChange}
                        error={!formData.password && error}
                        helperText={!formData.password && error ? "Password is required" : ""}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
                    />

                    {/* Error Message */}
                    {error && (
                        <Typography color="error" textAlign="center">
                            {error}
                        </Typography>
                    )}

                    {/* login Button */}
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
                        Login
                    </Button>

                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                        New to Carpool? <Link to="/signup">Register</Link>
                    </Typography>
          
                       
                    <Divider sx={{ marginY: 2, width:"100%"}}>OR</Divider>
            

                    {/* Continue with Google */}
                    <Button
                        variant="outlined"
                        fullWidth
                        disableElevation
                        startIcon={<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="24px" height="24px"><path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>}
                        sx={{
                            color: "black",
                            border: "1px solid black",
                            borderRadius: "50px",
                            textTransform: "none",
                            height: "50px",
                            fontSize: "1rem",
                        }}
                        onClick={handleGoogleLogin}
                    >
                        Continue with Google
                    </Button>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};

export default LoginCard;