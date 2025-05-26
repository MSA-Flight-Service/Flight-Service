import { Outlet, useLocation } from "react-router-dom";
import StepProgressBar from "../components/StepProgressBar.jsx";

import "./ReservationLayout.css"


function ReservationLayout() {
    const steps = [
        { label: '정보 확인', icon: '/images/rsvplane.png' },
        { label: '좌석 선택', icon: '/images/rsvseat.png' },
        { label: '추가정보 입력', icon: '/images/rsvuser.png' },
        { label: '최종 확인', icon: '/images/rsvcheck.png' },
        { label: '완료', icon: '/images/rsvticket.png' },
    ];
    const location = useLocation();

    const getStepFromPath = (pathname) => {
        if (pathname.includes('/flight/')) return 0;         // 정보 확인
        if (pathname.includes('/select/')) return 1;         // 좌석 선택
        if (pathname.includes('/form/')) return 2;           // 추가정보 입력
        if (pathname.includes('/confirm/')) return 3;        // 최종 확인
        if (pathname.includes('/complete')) return 4;        // 완료
        return 0;
    };

    const currentStep = getStepFromPath(location.pathname);

    return (
        <div className="reservation-layout">
            <div className="reservation-content">
                <StepProgressBar steps={steps} currentStep={currentStep} />
                <div className="reservation-outlet">
                <Outlet />
                </div>
            </div>
        </div>
    );
}

export default ReservationLayout;
