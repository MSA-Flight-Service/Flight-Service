import PlaceLink from "../components/home/PlaceLink.jsx";
import QuickLink from "../components/home/QuickLink.jsx";
import AdBanner from "../components/home/AdBanner.jsx";
import SearchFlight from "../components/flight/SearchFlight.jsx";
import GoogleMapPreview from "../components/map/GoogleMapPreview.jsx";
import "../styles/Home.css"

function Home() {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="home">
            <div className="banner">
                <img
                    src="/images/img1.jpg"
                    alt="Banner Image"
                    className="banner-img"
                />
                <img src="/images/mainplane.png" alt="Flying" className="flying-plane" />
            </div>

            <div className="contents-box">
                <SearchFlight />
                <GoogleMapPreview />
                <QuickLink />
                <AdBanner />
                <PlaceLink />
            </div>
            <div className="scroll-to-top" onClick={scrollToTop}>
                <p>↑ 페이지 상단으로 이동</p>
            </div>
        </div>
    )
}

export default Home;