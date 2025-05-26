import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/PlacePage.css"

const PlaceBySearch = () => {
    const location = useLocation();
    const passedKeyword = location.state?.tag || '축제';

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageNo, setPageNo] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [searchKeyword, setSearchKeyword] = useState(passedKeyword);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://apis.data.go.kr/B551011/KorService1/searchKeyword1', {
                    params: {
                        serviceKey: import.meta.env.VITE_API_KEY_b,
                        numOfRows: 6,
                        arrange: 'Q',
                        pageNo: pageNo,
                        MobileOS: 'ETC',
                        MobileApp: 'TestApp',
                        _type: 'json',
                        keyword: searchKeyword,
                    },
                });

                if (response.data.response.body.items.item) {
                    setData(response.data.response.body.items.item);
                    setError(null);
                } else {
                    setError('데이터가 없습니다.');
                    setData([]);
                }

                setLoading(false);
            } catch (err) {
                setError("데이터를 불러오는 데 실패했습니다. 다시 시도해주세요");
                console.log(`오류: ${err.message}`);
                setLoading(false);
            }
        };

        fetchData();
    }, [pageNo, searchKeyword]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPageNo(1);
        setSearchKeyword(keyword);
        setLoading(true);
    };

    return (
        <div className='placepage'>
            <h1>관광지 검색</h1>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit">검색</button>
            </form>

            <div className="results-section">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : data && data.length > 0 ? (
                    <div className="card-container">
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
                                    style={{ cursor: 'pointer' }}   >
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

export default PlaceBySearch;
