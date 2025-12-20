import React from "react";

const BookDetailModal = ({ book, onClose, toggleWishlist, isWished, onRent, isRented }) => {
    if (!book) return null;

    const wished = isWished(book.id);
    const rented = isRented(book.id);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>
                <div className="modal-image-wrapper">
                    <img
                        src={book.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:")}
                        alt={book.volumeInfo.title}
                        className="modal-image"
                    />
                </div>
                <div className="modal-info wrapper">
                    <div className="modal-title p-1">{book.volumeInfo.title}</div>
                    <div className="modal-author">
                        {book.volumeInfo.authors?.join(", ")} 저 | {book.volumeInfo.publisher}
                    </div>
                    <h4 style={{ marginBottom: "10px" }}>책 소개</h4>
                    <div className="modal-description">
                        {book.volumeInfo.description || "이 책에 대한 상세 설명이 없습니다."}
                    </div>
                    <div className="modal-actions">
                        <button
                            className={`btn-secondary ${wished ? "active-wish" : ""}`}
                            onClick={(e) => toggleWishlist(e, book)}
                        >
                            {wished ? "♥ 찜 취소" : "♡ 찜하기"}
                        </button>
                        <button
                            className={`btn-rent ${rented ? "active-rent" : ""}`}
                            onClick={() => onRent(book)}
                        >
                            {rented ? "✓ 대여중 (반납하기)" : "대여하기"}
                        </button>
                        <a
                            href={book.volumeInfo.infoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary"
                        >
                            구매하러 가기
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailModal;
