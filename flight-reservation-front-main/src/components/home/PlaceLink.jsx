import {useNavigate} from "react-router-dom";

import "./PlaceLink.css"

function PlaceLink() {
  const navigate = useNavigate();

  const places = [
    { id: 1, image: '/images/img2.jpg', tag: '가족' },
    { id: 2, image: '/images/img3.jpg', tag: '예술' },
    { id: 3, image: '/images/img4.jpg', tag: '체험' },
    { id: 4, image: '/images/img5.jpg', tag: '공원' },
    { id: 5, image: '/images/img6.jpg', tag: '축제' },
    { id: 6, image: '/images/img7.jpg', tag: '문화' },
    { id: 7, image: '/images/img8.jpg', tag: '자연' },
    { id: 8, image: '/images/img9.jpg', tag: '역사' },
  ];

  const handleItemClick = (tag) => {
    navigate('/splace', { state: { tag: tag } });
  };

  const handleLoadMoreClick = () => {
    navigate('/splace');
  };

  return (
      <div>
        <h1>추천 관광지</h1>
        <div className="image-list">
          {places.map(place => (
              <div key={place.id} className="image-item" onClick={() => handleItemClick(place.tag)}>
                <img src={place.image} alt="여행지 이미지" className="place-image" />
                <div className="tag">#{place.tag}</div>
              </div>
          ))}
        </div>
        <button className="load-more" onClick={handleLoadMoreClick}>더보기</button>
      </div>
  );
}

export default PlaceLink;