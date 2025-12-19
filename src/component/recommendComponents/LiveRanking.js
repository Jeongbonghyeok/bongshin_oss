import React, { useState, useEffect } from "react";

const LiveRanking = ({ books, openModal }) => {
    const [liveRankIndex, setLiveRankIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveRankIndex((prev) => (prev + 1) % 10);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    if (!books || books.length === 0) return null;

    return (
        <div
            className="live-ranking-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="live-ranking-label">실시간 추천도서 순위</div>
            <div
                className="live-ranking-content"
                onClick={() => openModal(books[liveRankIndex])}
                style={{ cursor: 'pointer' }}
            >
                <span className="ranking-num">{liveRankIndex + 1}.</span>
                {books[liveRankIndex]?.volumeInfo?.title || "로딩 중..."}
            </div>

            {/* Dropdown */}
            {isHovered && (
                <div className="live-ranking-dropdown">
                    <div className="dropdown-header">실시간 추천도서 순위 TOP 10</div>
                    <ul>
                        {books.slice(0, 10).map((book, idx) => (
                            <li key={book.id} onClick={() => openModal(book)}>
                                <span className={`ranking-num-list ${idx < 3 ? 'top-rank' : ''}`}>{idx + 1}</span>
                                <span className="ranking-title-list">{book.volumeInfo.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LiveRanking;
