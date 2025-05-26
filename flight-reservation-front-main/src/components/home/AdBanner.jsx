import {useEffect, useState} from "react";


const images = [
  '/images/adv1.png',
  '/images/adv2.png',
];

function AdBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '12px',
        width: '100%',
        height: '20vh',
        overflow: 'hidden',
        backgroundColor: '#e5e7eb',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: `${images.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
          transition: 'transform 0.5s ease-in-out',
          height: '100%',
        }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`배너 ${index + 1}`}
            style={{
              width: `${100 / images.length}%`,
              height: '100%',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '15px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '10px',
          fontSize: '12px',
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

export default AdBanner;
