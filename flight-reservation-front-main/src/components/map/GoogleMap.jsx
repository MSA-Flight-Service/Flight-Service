import "../../styles/FlightOverlay.css";
import {useEffect, useRef, useState} from "react";
import {GoogleMap, OverlayView, useLoadScript} from "@react-google-maps/api";
import PlaneMarker from "./PlaneMarker.jsx";
import {allAirports} from "../../data/allAirports.js";
import {filterAirportsByDistance} from "../../data/fucntionDistance.js";

function getRotationAngle(from, to) {
    const deltaLng = to.lng - from.lng;
    const deltaLat = to.lat - from.lat;
    const angleRad = Math.atan2(deltaLng, deltaLat);
    return angleRad * (180 / Math.PI);
}

const containerStyle = {
    width: "100%",
    height: "100%",
};

const softDarkStyle = [
    { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
    { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#223a5e" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6f9ba5" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1e3d59" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#76cfa6" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c4a74" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4e6d94" }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4e6d94" }] },
];

const center = { lat: 35, lng: 130 };
const continentHubCodes = ["SIN", "DXB", "LHR", "JFK", "GRU", "JNB", "SYD"];

function GoogleMapInternational({ departure, arrival, setArrival }) {
    const [visibleAirports, setVisibleAirports] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(2);
    const [hoveredAirport, setHoveredAirport] = useState(null);
    const [planePosition, setPlanePosition] = useState(null);
    const [planeAngle, setPlaneAngle] = useState(0);

    const mapRef = useRef(null);
    const polylineRef = useRef(null);
    const animationRef = useRef(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    const handleClick = (airport) => {
        if (!airport || airport.code === departure.code) return;
        setArrival((prev) => (prev?.code === airport.code ? null : airport));
    };

    const updateVisibleAirports = (map) => {
        const bounds = map.getBounds();
        const zoom = map.getZoom();
        setZoomLevel(zoom);
        if (!bounds) return;

        const inBounds = allAirports.filter((airport) => {
            const pos = new window.google.maps.LatLng(airport.lat, airport.lng);
            return bounds.contains(pos);
        });

        const minDistance = zoom >= 5 ? 50 : zoom >= 4 ? 200 : 300;
        const filtered = filterAirportsByDistance(inBounds, minDistance, continentHubCodes)
            .filter((airport) => airport.code !== departure.code && (airport.code !== "GMP" || zoom >= 4));

        setVisibleAirports(filtered);
    };

    useEffect(() => {
        if (!mapRef.current) return;

        if (polylineRef.current) polylineRef.current.setMap(null);
        if (animationRef.current) clearInterval(animationRef.current);

        if (arrival) {
            const line = new window.google.maps.Polyline({
                path: [departure, arrival],
                geodesic: true,
                strokeColor: "#aac5cb",
                strokeOpacity: 0.7,
                strokeWeight: 2,
            });

            line.setMap(mapRef.current);
            polylineRef.current = line;

            const steps = 200;
            let currentStep = 0;

            const from = new window.google.maps.LatLng(departure.lat, departure.lng);
            const to = new window.google.maps.LatLng(arrival.lat, arrival.lng);

            animationRef.current = setInterval(() => {
                const fraction = currentStep / steps;
                const interpolated = window.google.maps.geometry.spherical.interpolate(from, to, fraction);

                const nextStepOffset = 5;
                const nextFraction = Math.min((currentStep + nextStepOffset) / steps, 1);
                const next = window.google.maps.geometry.spherical.interpolate(from, to, nextFraction);

                const currentPos = { lat: interpolated.lat(), lng: interpolated.lng() };
                const nextPos = { lat: next.lat(), lng: next.lng() };

                setPlanePosition(currentPos);
                setPlaneAngle(getRotationAngle(currentPos, nextPos));

                currentStep++;
                if (currentStep > steps) clearInterval(animationRef.current);
            }, 50);
        }

        return () => {
            if (animationRef.current) clearInterval(animationRef.current);
        };
    }, [arrival, departure]);

    if (!isLoaded) return <div>지도 로딩 중...</div>;

    return (
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={2.7}
                onLoad={(map) => {
                    mapRef.current = map;
                    updateVisibleAirports(map);
                }}
                onIdle={() => updateVisibleAirports(mapRef.current)}
                options={{ minZoom: 2, maxZoom: 10, styles: softDarkStyle }}
            >
                {planePosition && <PlaneMarker position={planePosition} angle={planeAngle} />}

                <OverlayView position={{ lat: departure.lat, lng: departure.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                    <div className="fixed-departure-marker" title={departure.name}>
                        <div className="fixed-marker-label">{departure.name}</div>
                    </div>
                </OverlayView>

                {visibleAirports.map((airport) => (
                    <OverlayView
                        key={airport.code}
                        position={{ lat: airport.lat, lng: airport.lng }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        {continentHubCodes.includes(airport.code) || zoomLevel >= 6 ? (
                            <div
                                className={`flight-overlay ${airport.code === arrival?.code ? "active" : ""}`}
                                onClick={() => handleClick(airport)}
                                onMouseEnter={() => setHoveredAirport(airport)}
                                onMouseLeave={() => setHoveredAirport(null)}
                                title={airport.name}
                            >
                                <div className="airport-name">{airport.name}</div>
                                <div className="airport-price">₩{airport.price.toLocaleString()}~</div>
                            </div>
                        ) : (
                            <div
                                className={`airport-dot ${airport.code === arrival?.code ? "active" : ""}`}
                                onClick={() => handleClick(airport)}
                                onMouseEnter={() => setHoveredAirport(airport)}
                                onMouseLeave={() => setHoveredAirport(null)}
                                title={airport.name}
                            />
                        )}
                    </OverlayView>
                ))}

                {(hoveredAirport || arrival) && (
                    <OverlayView
                        position={{
                            lat: (hoveredAirport ?? arrival).lat,
                            lng: (hoveredAirport ?? arrival).lng,
                        }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div className="hover-box">
                            <div className="airport-name">{(hoveredAirport ?? arrival).name}</div>
                            <div className="airport-price">₩{(hoveredAirport ?? arrival).price.toLocaleString()}~</div>
                        </div>
                    </OverlayView>
                )}
            </GoogleMap>
        </div>
    );
}

export default GoogleMapInternational;