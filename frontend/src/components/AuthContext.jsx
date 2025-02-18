import { createContext, useState, useEffect } from "react";
import axios from "axios";


// Creating a Auth Context to provide user context throuout the web app
export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const fetchUser = async () => {
        try {
            const response = await axios.get("http://localhost:3000/auth/me", {
                withCredentials: true, // Send cookies with request
            });
            setUser(response.data);
        } catch (error) {
            console.error("Authentication failed:", error.response?.data || error.message);
            setUser(null);
        }
    };

    // Fetching user again on each refresh to keep user logged in 

    useEffect(() => {
        fetchUser();
    }, []);

    // Logut function to remove the user form auth context 
     
    const logout = async () => {
       
        try {
            await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
            setUser(null);
         
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
        }
    };

  

    
  
// Providing user , logout and fetch user functions to auth provider to enable them to be accessed globally across my app
    return (
        <AuthContext.Provider value={{ user, logout , fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};