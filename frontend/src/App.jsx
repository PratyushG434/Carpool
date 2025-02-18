import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./components/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Importing Pages
import Home from './pages/home';
import Login from './pages/Login';
import SignUp from "./pages/SignUp";
import SearchRides from "./pages/SearchRides";
import Rides from "./pages/AvailableRides";
import MyRides from "./pages/MyRides";
import PendingRequests from "./pages/PendingRequests";
import RequestsSent from "./pages/RequestsSent";
import MyPastPools from "./pages/MyPastPools";
import AllRides from "./pages/AllRides";
import NotFound from "./pages/NotFound";


// Adding protection for routes so that user cannot access without login 
function ProtectedRoute({ children }) {
  const {user} = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    // Defining all the routes 
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchRides />} />
        <Route path="/requests" element={<ProtectedRoute><PendingRequests /></ProtectedRoute>} />
        <Route path="/rides" element={<ProtectedRoute><Rides /></ProtectedRoute>} />
        <Route path="/myrides" element={<ProtectedRoute><MyRides /></ProtectedRoute>} />
        <Route path="/requestssent" element={<ProtectedRoute><RequestsSent /></ProtectedRoute>} />
        <Route path="/mypastpools" element={<ProtectedRoute><MyPastPools /></ProtectedRoute>} />
        <Route path="/allrides" element={<ProtectedRoute><AllRides /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      
      </Routes>
      
    </Router>
  );
}

export default App;