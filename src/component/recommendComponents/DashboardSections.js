import React from "react";

export const AuthorSection = ({ books, openModal, toggleWishlist, isWished }) => {
    return (
        <section className="dashboard-section author-recommend-section">
            <div className="dashboard-title ms-3" style={{backgroundColor:'#faf7f5'}}>작가의 추천도서</div>
            <div className="author-content-wrapper">
                <div className="author-profile ">
                    <div className="author-card-bg mt-2" style={{backgroundColor:'#faf7f5'}}>
                        <h3 style={{backgroundColor:'#faf7f5', color:'black'}} className="m-1">정봉혁</h3>
                        <br/>
                        <p className="m-1" style={{backgroundColor:'#faf7f5', color:'black'}} >작가의 선택</p>
                        <hr style={{ borderColor: 'rgba(255,255,255,0.3)', margin: '15px 0',color:'black' }} />
                        <p style={{ fontSize: '12px',backgroundColor:'#faf7f5', color:'black' }} className="p-1 m-1">SF가 그리는 미래</p>
                    </div>
                </div>
                <div className="author-books-scroll mt-2">
                    {books.map(book => (
                        <div key={book.id} className="mini-book-card" onClick={() => openModal(book)}>
                            <div className="mini-cover-wrapper" style={{ position: 'relative' }}>
                                <img
                                    src={book.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:")}
                                    alt={book.volumeInfo.title}
                                    className="mini-book-cover"
                                />
                                <button
                                    className={`heart-btn-mini ${isWished(book.id) ? 'active' : ''}`}
                                    onClick={(e) => toggleWishlist(e, book)}
                                >
                                    {isWished(book.id) ? "♥" : "♡"}
                                </button>
                            </div>
                            <div className="mini-book-title">
                                {book.volumeInfo.title.slice(0, 15) + (book.volumeInfo.title.length > 15 ? "..." : "")}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <br/><br/>
        </section>
    );
};

export const MediaSection = ({ books, openModal, toggleWishlist, isWished }) => {
    return (
        <section className="dashboard-section media-recommend-section">
            <br/>
            <div className="dashboard-title ms-3" style={{backgroundColor:'rgb(231, 222, 210)'}}>이주의 미디어 추천도서</div>
            <div className="media-container">
                <div className="character-area">
                    <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="Character" className="character-img m-2" />
                    <p style={{ fontWeight: 'bold', backgroundColor:'rgb(242, 235, 227)'}} className="mt-2">봉신맨의 Pick!</p>
                </div>
                <div className="media-grid p-3">
                    {books.slice(0, 8).map(book => (
                        <div key={book.id} className="mini-book-card" onClick={() => openModal(book)}>
                            <div className="mini-cover-wrapper" style={{ position: 'relative' }}>
                                <img
                                    src={book.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:")}
                                    alt={book.volumeInfo.title}
                                    className="mini-book-cover"
                                />
                                <button
                                    className={`heart-btn-mini ${isWished(book.id) ? 'active' : ''}`}
                                    onClick={(e) => toggleWishlist(e, book)}
                                >
                                    {isWished(book.id) ? "♥" : "♡"}
                                </button>
                            </div>
                            <div className="mini-book-title">
                                {book.volumeInfo.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <br/><br/>
        </section>
    );
};

export const BlackSection = ({ books, openModal }) => {
    return (
        <section className="dashboard-section black-theme-section">
            <div className="black-theme-container">
                <div className="black-left">
                    <h2 className="m-2 p-3" style={{color:'gray'}}>21세기 최고의 책</h2>
                    <p className="m-2 p-3" style={{ marginTop: '20px', fontWeight: 'bold',color:'gray' }}>신태현 번역가의 10권</p>
                </div>
                <div className="black-list" >
                    {books.map((book) => (
                        <div key={book.id} className="black-list-item" onClick={() => openModal(book)}>
                            <div className="black-book-title" style={{color:'gray'}}>{book.volumeInfo.title}</div>
                            <div className="black-book-author" style={{color:'gray'}}>
                                {book.volumeInfo.authors?.join(", ")} | {book.volumeInfo.publishedDate?.slice(0, 4)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <br/><br/>
        </section>
    );
};
