import {useNavigate} from "react-router-dom";

import "./GoogleMapPreview.css"

function GoogleMapPreview() {
    const navigate = useNavigate();

    return (
        <div className="map-preview-container">
            <div className="map-blur-overlay" onClick={() => navigate("/map")}>
                <p className="overlay-text">🗺 지도로 항공편 탐색하기</p>
            </div>
            <div className="google-map-embed">
                {/* 여기에 GoogleMap 또는 이미지 미리보기 */}
                <img src="/images/map-preview.png" alt="Map Preview" />
            </div>
        </div>
    );
}

export default GoogleMapPreview;
