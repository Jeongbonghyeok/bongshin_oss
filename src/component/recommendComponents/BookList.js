import React from "react";

const BookList = ({ books, loading, category, openModal, toggleWishlist, isWished }) => {
    return (
        <section className="book-section">
            <div className="section-title">
                <span className="highlight">{category}</span> 관련 추천 도서
            </div>

            {loading ? (
                <div className="loading-indicator">책을 불러오는 중입니다...</div>
            ) : (
                <div className="book-grid">
                    {books.map((book, idx) => {
                        const info = book.volumeInfo;
                        const randomName = ["김효신", "박동영", "김경영", "노란", "임이지", "김세희"][idx % 6];
                        const wished = isWished(book.id);

                        return (
                            <article key={book.id} className="book-card" onClick={() => openModal(book)}>
                                <div className="book-cover-wrapper">
                                    {info.imageLinks?.thumbnail ? (
                                        <img
                                            src={info.imageLinks.thumbnail.replace("http:", "https:")}
                                            alt={info.title}
                                            className="book-cover"
                                        />
                                    ) : (
                                        <div className="book-cover" style={{ backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
                                    )}
                                </div>

                                <div className="book-info">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="book-category-label">
                                            {info.categories && info.categories.length > 0 ? info.categories[0] : "일반"}
                                        </span>
                                        <button
                                            className={`heart-btn ${wished ? 'active' : ''}`}
                                            onClick={(e) => toggleWishlist(e, book)}
                                        >
                                            {wished ? "♥" : "♡"}
                                        </button>
                                    </div>

                                    <div className="book-title">
                                        {info.title}
                                    </div>

                                    <div className="book-meta">
                                        {info.authors?.join(", ")} 지음 | {info.publisher}
                                    </div>

                                    <p className="book-desc">
                                        {info.description ? info.description.slice(0, 100) + "..." : "책 소개가 없습니다."}
                                    </p>

                                    <div className="book-reviewer">
                                        - {randomName} MD
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default BookList;
