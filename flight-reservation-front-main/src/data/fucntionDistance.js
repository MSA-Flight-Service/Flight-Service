// 하버사인 거리 계산
export const haversineDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // 지구 반지름 (km)

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// 최소 거리 기준 필터링 함수
// filterAirportsByDistance.js 내부에서 continentHubCodes 포함 처리
export const filterAirportsByDistance = (airports, minDistance = 100, hubCodes = []) => {
    const result = [];

    for (let i = 0; i < airports.length; i++) {
        const current = airports[i];

        // ✅ 허브 공항은 무조건 포함
        if (hubCodes.includes(current.code)) {
            result.push(current);
            continue;
        }

        let tooClose = false;
        for (const added of result) {
            const dist = haversineDistance(current.lat, current.lng, added.lat, added.lng);
            if (dist < minDistance) {
                tooClose = true;
                break;
            }
        }

        if (!tooClose) result.push(current);
    }

    return result;
};

