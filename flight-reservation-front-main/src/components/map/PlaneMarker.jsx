// components/PlaneMarker.jsx
import { OverlayView } from "@react-google-maps/api";

function PlaneMarker({ position ,angle = 0 }) {
    return (
        <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <img
                src="/images/plane.png"
                alt="plane"
                style={{
                    width: "40px",
                    transform: ` translate(-50%, -50%) rotate(${angle}deg)`,
                    transition: "transform 0.1s linear",
                }}
            />
        </OverlayView>
    );
}

export default PlaneMarker;
