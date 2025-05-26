import React, { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import "../../styles/GeminiSummary.css";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const GeminiSummary = ({ city }) => {
    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!city) return;

        const fetchSummary = async () => {
            setLoading(true);
            setLines([]); // 새로 시작할 때 초기화

            try {
                const result = await ai.models.generateContent({
                    model: "gemini-1.5-flash",
                    contents: `여행지 ${city}에 대해 주의사항, 추천 명소, 이벤트를 3줄씩 요약해줘. 마크다운 없이 순수 텍스트로.`,
                });

                const text = await result.text;
                const splitLines = text.trim().split("\n");

                // 한 줄씩 시간차로 추가
                splitLines.forEach((line, index) => {
                    setTimeout(() => {
                        setLines((prev) => [...prev, line]);
                    }, index * 300); // 0.3초 간격
                });
            } catch (err) {
                console.error("Gemini 오류:", err);
                setLines(["요약을 불러오지 못했습니다."]);
            }

            setLoading(false);
        };

        fetchSummary();
    }, [city]);

    return (
        <div className="summaryText">
            {loading && <p>불러오는 중...</p>}
            {!loading && lines.map((line, idx) => (
                <p key={idx} className="fadeInLine">
                    {line}
                </p>
            ))}
        </div>
    );
};

export default GeminiSummary;
