import Navigation from "../components/Navigation";
import CreateRide from "../components/CreateRideCard";


// Home page + Create ride page
const Home = () => {
    
    
    return (
        <>
            <Navigation />
            <div className="mainDiv">
                <div className="contentContainer">
                    <div className="imageContainer">
                        <img src="../../Carpool.jpg" alt="photo" />
                    </div>
                    <CreateRide />
                </div>
            </div>
            

        </>);
       
    };


export default Home;