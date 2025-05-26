import {useEffect, useState} from "react";
import axios from "axios";

import "../styles/PlacePage.css"


const PlaceByRegion = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageNo, setPageNo] = useState(1);
    const [areaCode, setAreaCode] = useState(1);

    const regions = [
        { code: 1, name: '서울' },
        { code: 2, name: '인천' },
        { code: 3, name: '대전' },
        { code: 4, name: '대구' },
        { code: 5, name: '광주' },
        { code: 6, name: '부산' },
        { code: 32, name: '강원' },
        { code: 39, name: '제주' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // API 호출
                const response = await axios.get('https://apis.data.go.kr/B551011/KorService1/areaBasedList1', {
                    params: {
                        serviceKey: import.meta.env.VITE_API_KEY_b,  // 발급받은 서비스 키
                        numOfRows: 6,  // 한 번에 가져올 데이터 개수
                        contentTypeId: 12, //관광지
                        arrange: 'Q', //정렬 타입
                        pageNo: pageNo, // 현재 페이지 번호
                        MobileOS: 'ETC', // 모바일 OS
                        MobileApp: 'TestApp', // 모바일 앱 이름
                        _type: 'json', // 응답 형식 (json)
                        areaCode: areaCode, // 지역 코드 (상태에 따라 변경)
                    },
                });

                if (response.data.response.body.items.item) {
                    setData(response.data.response.body.items.item);
                } else {
                    setError('데이터가 없습니다.');
                }

                setLoading(false);
            } catch (err) {
                setError("데이터를 불러오는 데 실패했습니다. 다시 시도해주세요");
                console.log(`오류: ${err.message}`);
                setLoading(false);
            }
        };

        fetchData();
    }, [pageNo, areaCode]);

    const handleAreaChange = (newAreaCode) => {
        setAreaCode(newAreaCode);
        setPageNo(1);
    };


    return (
        <div className='placepage'>
            <h1>지역별 추천 관광지</h1>

            <div className="region-buttons">
                {regions.map((region) => (
                    <button
                        key={region.code}
                        onClick={() => handleAreaChange(region.code)}
                        className={areaCode === region.code ? 'selected' : ''}
                    >
                        {region.name}
                    </button>
                ))}
            </div>

            <div className="results-section">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : data && data.length > 0 ? (
                    <div className="card-container" >
                        {data
                            .filter(item =>
                                item.addr1 && item.addr1.trim() !== '' &&
                                item.firstimage && item.firstimage.trim() !== ''
                            )
                            .map((item, index) => (
                                <div key={index} className="card"
                                    onClick={() => {
                                        const confirmMove = window.confirm("외부 링크로 이동됩니다. 이동할까요?");
                                        if (confirmMove) {
                                            window.open(`https://www.google.com/search?q=${encodeURIComponent(item.title)}`, '_blank');
                                        }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={item.firstimage || "https://via.placeholder.com/150"} alt={item.title} className="card-image" />
                                    <h2>{item.title}</h2>
                                    <p>{item.addr1}</p>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p>해당 지역에 대한 정보가 없습니다.</p>
                )}
            </div>

            <div className="pagination">
                <button onClick={() => setPageNo(prevPageNo => prevPageNo - 1)} disabled={pageNo <= 1}>
                    이전
                </button>
                <button onClick={() => setPageNo(prevPageNo => prevPageNo + 1)}>
                    다음
                </button>
            </div>
        </div>
    );
};

export default PlaceByRegion;
