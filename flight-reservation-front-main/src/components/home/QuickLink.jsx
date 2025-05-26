import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./QuickLink.css"

function QuickLink() {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollStart, setScrollStart] = useState(0);
    const [hasMoved, setHasMoved] = useState(false); // ⬅️ 이동 여부 추가
    const navigate = useNavigate();

    const data = [
        { id: 1, title: "항공권 검색", item: "원하는 항공편 검색하기", image: "/images/searchflight.png", link: "/flight" },
        { id: 2, title: "관광지 검색", item: "관광지 정보 확인하기", image: "/images/travel.png", link: "/sPlace" },
        { id: 3, title: "고객 지원", item: "고객 센터 바로가기", image: "/images/help.png", link: "/help" },
        { id: 4, title: "항공권 혜택", item: "특별 할인 혜택 확인하기", image: "/images/gift.png", link: "/event" },
    ];

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollStart(scrollRef.current.scrollLeft);
        setHasMoved(false); // 드래그 시작 시 이동 안 한 상태로 초기화
        document.body.style.userSelect = "none";
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
        document.body.style.userSelect = "auto";
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.0;
        if (Math.abs(walk) > 5) { // 이동 거리 임계값
            setHasMoved(true);
        }
        scrollRef.current.scrollLeft = scrollStart - walk;
    };

    const handleCardClick = (link) => {
        if (!hasMoved) { // ⬅️ 클릭으로 간주되는 경우만 이동
            navigate(link);
        }
    };

    return (
        <div>
            <ul
                ref={scrollRef}
                className={`quicklink-scroll ${isDragging ? "dragging" : ""}`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onMouseMove={handleMouseMove}
            >
                {data.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => handleCardClick(item.link)}
                        className="quicklink-item"
                    >
                        <div className="quicklink-text">
                            <h3>{item.title}</h3>
                            <p>{item.item}</p>
                        </div>
                        <div className="quicklink-image-placeholder">
                            <img src={item.image} alt={item.title} className="quicklink-image" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default QuickLink;
