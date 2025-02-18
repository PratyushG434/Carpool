import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import SearchIcon from '@mui/icons-material/Search';
import { Link , useNavigate} from "react-router-dom";
import { useContext ,useEffect} from "react";
import { AuthContext } from "./AuthContext";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatBadge from "./Notification";

function Navigation() {

  // extracting user and logout from auth context 
  var {user, logout} = useContext(AuthContext);
const navigate = useNavigate();


// Navbar 
  return (
    <Navbar expand="lg" className="custom-nav">
      <Container>
        {/* Navbar Brand (Left Side) */}
        <Navbar.Brand as={Link} to="/">Carpool</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

  
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> 
            <Nav.Link as={Link} to="/search">
              <SearchIcon fontSize="small" sx={{color:"black"}}/> Search Ride
            </Nav.Link>
            <Nav.Link as={Link} to="/">
              <AddCircleOutlineIcon sx={{fontSize:"18px", color:"black"}}/> Create Ride
            </Nav.Link>
            {!user||<Nav.Link as={Link} to="/requests">   {/* requests badge to show number of pending requests  */}
              <ChatBadge></ChatBadge>Requests
            </Nav.Link>}
            {user?(
            <NavDropdown title={<AccountCircleIcon fontSize="medium" sx={{color:"black"}}/>} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/myrides">My rides</NavDropdown.Item>
              {/* <NavDropdown.Item as={Link} to="/requests">Requests Received</NavDropdown.Item> */}
              <NavDropdown.Item as={Link} to="/requestssent">Requests Sent</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/mypastpools">My Past Pools</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/allRides">All Rides</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={()=>{logout(); navigate('/')}}>Logout</NavDropdown.Item>
            </NavDropdown>):
            (
            <NavDropdown title={<AccountCircleIcon fontSize="medium" sx={{color:"black"}}/>} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/signup">Sign Up</NavDropdown.Item>
             
            </NavDropdown>)
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;