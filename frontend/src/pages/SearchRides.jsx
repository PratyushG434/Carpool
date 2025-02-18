import SearchCard from "../components/SearchCard";
import Navigation from "../components/Navigation";




// Search page to serach for rides
const SearchRides = () => {

    return (
        <>
            <Navigation />
            <div className="mainDiv">
                <div className="contentContainer">
                    <div className="imageContainer">
                        <img src="../../search.jpg" alt="photo" />
                    </div>
                    <SearchCard />
                </div>
            </div>
        </>
    );
};


export default SearchRides;