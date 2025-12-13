import React from "react";

const WishlistSidebar = ({ isOpen, onClose, wishlist, toggleWishlist, onGoMyPage, onRent, isRented }) => {
    if (!isOpen) return null;

    return (
        <div className="wishlist-overlay" onClick={onClose}>
            <div className="wishlist-sidebar" onClick={(e) => e.stopPropagation()}>
                <div className="wishlist-header">
                    <h3>나의 찜 리스트</h3>
                    <button onClick={onClose}>&times;</button>
                </div>
                {wishlist.length === 0 ? (
                    <div className="wishlist-empty">찜한 도서가 없습니다.</div>
                ) : (
                    <ul className="wishlist-items">
                        {wishlist.map((item) => (
                            <li key={item.id} className="wishlist-item">
                                <img src={item.volumeInfo.imageLinks?.thumbnail} alt="" />
                                <div className="wishlist-item-info">
                                    <div className="wishlist-item-title">{item.volumeInfo.title}</div>
                                    <div className="wishlist-btns">
                                        <button
                                            className={`wishlist-rent-btn ${isRented && isRented(item.id) ? "rented" : ""}`}
                                            onClick={() => onRent(item)}
                                        >
                                            {isRented && isRented(item.id) ? "반납하기" : "대여하기"}
                                        </button>
                                        <button
                                            className="wishlist-remove-btn"
                                            onClick={(e) => toggleWishlist(e, item)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <button className="mypage-btn" onClick={onGoMyPage}>
                    My Page로 이동
                </button>
            </div>
        </div>
    );
};


export default WishlistSidebar;
