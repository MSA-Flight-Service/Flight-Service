import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-column">
          <h3 className="footer-title">Airplanit</h3>
          <p>Airplanit은 전 세계 항공권 예매와 인기 관광지 검색을 손쉽게 도와주는 여행 플랫폼입니다.</p>
          <p>여행 준비, 지금 시작하세요.</p>
        </div>

        <div className="footer-column">
          <h4 className="footer-subtitle">회사 소개</h4>
          <ul>
            <li>회사명: 주식회사 에어플래닛</li>
            <li>사업자등록번호: 123-45-67890</li>
            <li>주소: 서울특별시 중구 여행로 123, 7층</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-subtitle">고객 지원</h4>
          <ul>
            <li>자주 묻는 질문</li>
            <li>문의하기</li>
            <li>항공권 취소/변경</li>
            <li>마이페이지</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-subtitle">법적 고지</h4>
          <ul>
            <li>이용약관</li>
            <li>개인정보처리방침</li>
            <li>전자금융거래약관</li>
            <li>책임의 한계와 법적 고지</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>고객센터: 1234-5678 (평일 09:00~18:00, 점심시간 12:00~13:00)</p>
        <p>이메일: support@airplanit.co.kr</p>
        <p>© 2025 Airplanit Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
