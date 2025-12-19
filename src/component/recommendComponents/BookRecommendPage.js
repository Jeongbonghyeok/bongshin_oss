import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BookRecommendPage.css";
import Header from "../Header";

// Sub-components
import LiveRanking from "./LiveRanking";
import CategorySidebar from "./CategorySidebar";
import BookList from "./BookList";
import { AuthorSection, MediaSection, BlackSection } from "./DashboardSections";
import BookDetailModal from "./BookDetailModal";
import WishlistSidebar from "./WishlistSidebar";

const API_KEY = "AIzaSyA1Oo9pmCtewgLXwy8fcxHpd4V9YXRzFKM";
const MOCK_API = "https://693133bc11a8738467cda490.mockapi.io/information";

// ✅ 대여목록 저장 필드 (Mock에 books로 저장중이면 "books"로 변경)
const RENT_FIELD = "books";

const CATEGORIES = [
  { name: "종합", query: "bestseller" },
  { name: "건강/취미", query: "health" },
  { name: "경제경영", query: "business" },
  { name: "과학", query: "science" },
  { name: "만화", query: "comics" },
  { name: "사회과학", query: "social science" },
  { name: "소설/시/희곡", query: "fiction" },
  { name: "수험서/자격증", query: "exam" },
  { name: "어린이", query: "children" },
  { name: "에세이", query: "essay" },
  { name: "여행", query: "travel" },
  { name: "역사", query: "history" },
  { name: "예술/대중문화", query: "art" },
  { name: "외국어", query: "language" },
  { name: "요리/살림", query: "cooking" },
  { name: "인문학", query: "humanities" },
  { name: "자기계발", query: "self-help" },
  { name: "컴퓨터/모바일", query: "programming" },
];

function BookRecommendPage() {
  const { ID } = useParams();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState("종합");
  const [loading, setLoading] = useState(false);

  // Modal & Selection
  const [selectedBook, setSelectedBook] = useState(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Delete & Toast State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // Dashboard Data
  const [authorBooks, setAuthorBooks] = useState([]);
  const [mediaBooks, setMediaBooks] = useState([]);
  const [blackBooks, setBlackBooks] = useState([]);

  // Rent State (✅ 이 배열이 Mock에 저장됨: "대여한 책 id 목록")
  const [rentedBooks, setRentedBooks] = useState([]);
  const [rentConfirmTarget, setRentConfirmTarget] = useState(null);
  const [confirmType, setConfirmType] = useState("RENT"); // 'RENT' or 'RETURN'

  // ✅ X코드 방식(하이드레이션/덮어쓰기 방지)
  const didMountRent = useRef(false);
  const rentHydrated = useRef(false);

  // --- Google Books API ---
  const fetchBooks = async (query) => {
    if (!API_KEY) return;
    setLoading(true);
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&maxResults=10&key=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setBooks(data.items || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchSectionBooks = async (query, setter) => {
    if (!API_KEY) return;
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&maxResults=8&key=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setter(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Mock: Load (hydrate) ---
  const getMyInformation = async () => {
    if (!ID) return;

    try {
      const res = await fetch(`${MOCK_API}/${ID}`);
      const user = await res.json();

      // ✅ RENT_FIELD 우선, 없으면 rentedBooks/books fallback
      const rentedFromMock = user?.[RENT_FIELD] ?? user?.books ?? user?.rentedBooks ?? [];


      setRentedBooks(Array.isArray(rentedFromMock) ? rentedFromMock : []);
      rentHydrated.current = true; // ✅ 이제부터 저장 허용
    } catch (e) {
      console.error("유저 정보 로드 실패:", e);
    }
  };

  // ✅ ID 바뀔 때 리셋 후 hydrate
  useEffect(() => {
    didMountRent.current = false;
    rentHydrated.current = false;
    setRentedBooks([]);
    getMyInformation();
  }, [ID]);

  // --- Mock: Save ---
  const updateRentedToMock = async (nextRentedIds) => {
    if (!ID) return;

    try {
      const res = await fetch(`${MOCK_API}/${ID}`);
      const user = await res.json();

      const nextUser = { ...user, [RENT_FIELD]: nextRentedIds };

      const putRes = await fetch(`${MOCK_API}/${ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextUser),
      });

      if (!putRes.ok) throw new Error("PUT failed");
    } catch (e) {
      console.error("mock rentedBooks 업데이트 실패:", e);
    }
  };

  // ✅ rentedBooks 바뀌면 자동 저장 (확정 버튼: executeAction에서 setRentedBooks만 함)
  useEffect(() => {
    if (!ID) return;

    if (!didMountRent.current) {
      didMountRent.current = true;
      return;
    }
    if (!rentHydrated.current) return;

    updateRentedToMock(rentedBooks);
  }, [rentedBooks]);

  // --- Initial fetch ---
  useEffect(() => {
    fetchBooks("bestseller");
    fetchSectionBooks("김초엽", setAuthorBooks);
    fetchSectionBooks("영화 드라마 원작", setMediaBooks);
    fetchSectionBooks("humanity masterpiece", setBlackBooks);
  }, []);

  // --- UI handlers ---
  const showToast = (msg) => {
    setToast({ msg });
    setTimeout(() => setToast(null), 2000);
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat.name);
    fetchBooks(cat.query);
  };

  const openModal = (book) => {
    if (!book) return;
    setSelectedBook(book);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedBook(null);
    document.body.style.overflow = "auto";
  };

  const toggleWishlist = (e, book) => {
    e.stopPropagation();
    const exists = wishlist.some((item) => item.id === book.id);

    if (exists) {
      setDeleteTarget(book);
    } else {
      setWishlist([...wishlist, book]);
      setIsWishlistOpen(true);
    }
  };

  // --- Rent handlers (✅ 버튼은 여기로 연결하면 됨) ---
  const isRented = (bookId) => rentedBooks.includes(bookId);

  // ✅ "대여/반납 시작 버튼"에 연결할 함수 (모달 띄움)
  const handleRent = (book) => {
    if (!book?.id) return;

    if (isRented(book.id)) {
      setConfirmType("RETURN");
      setRentConfirmTarget(book);
    } else {
      setConfirmType("RENT");
      setRentConfirmTarget(book);
    }
  };

  // ✅ "확정(네)" 버튼: setRentedBooks만 하고, 저장은 useEffect가 함
  const executeAction = () => {
    if (!rentConfirmTarget) return;

    if (confirmType === "RENT") {
      setRentedBooks((prev) =>
        prev.includes(rentConfirmTarget.id) ? prev : [...prev, rentConfirmTarget.id]
      );
      showToast("도서가 대여되었습니다.");
    } else {
      setRentedBooks((prev) => prev.filter((id) => id !== rentConfirmTarget.id));
      showToast("도서가 반납되었습니다.");
    }
    setRentConfirmTarget(null);
  };

  const cancelRent = () => setRentConfirmTarget(null);

  const getRentDates = () => {
    const now = new Date();
    const returnDate = new Date(now);
    returnDate.setDate(now.getDate() + 7);

    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const mins = String(date.getMinutes()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd} ${hours}:${mins}`;
    };

    return { now: formatDate(now), returnDate: formatDate(returnDate) };
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setWishlist((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast("삭제됨");
    }
  };

  const cancelDelete = () => setDeleteTarget(null);

  const isWished = (bookId) => wishlist.some((item) => item.id === bookId);

  // Navigation
  const handleGoBack = () => navigate(`/main/${ID}`);
  const handleGoMyPage = () => navigate(`/mypage/${ID}`);

  return (<>
   
    <div className="recommend-container">
      {toast && <div className="toast-notification">{toast.msg}</div>}
      {deleteTarget && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>정말 삭제하시겠습니까?</p>
            <div className="confirm-buttons">
              <button className="confirm-btn-yes" onClick={confirmDelete}>
                삭제
              </button>
              <button className="confirm-btn-no" onClick={cancelDelete}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 여기 "네"가 확정 저장 트리거 */}
      {rentConfirmTarget && (
        <div className="confirm-overlay">
          <div className="confirm-box rent-confirm-box">
            <h3>{confirmType === "RENT" ? "대여 확인" : "반납 확인"}</h3>
            <p className="rent-confirm-msg">
              '{rentConfirmTarget.volumeInfo.title}'<br />
              {confirmType === "RENT" ? "대여하시겠습니까?" : "반납하시겠습니까?"}
            </p>

            <div className="rent-dates">
              {confirmType === "RENT" ? (
                <>
                  <div className="rent-date-row">
                    <span className="date-label">대여일:</span>
                    <span className="date-value">{getRentDates().now}</span>
                  </div>
                  <div className="rent-date-row">
                    <span className="date-label">반납예정일:</span>
                    <span className="date-value return-highlight">
                      {getRentDates().returnDate}
                    </span>
                  </div>
                  <p className="rent-note">* 대여 기간은 1주일입니다.</p>
                </>
              ) : (
                <div className="rent-date-row">
                  <span className="date-label">반납일:</span>
                  <span className="date-value">{getRentDates().now}</span>
                </div>
              )}
            </div>

            <div className="confirm-buttons">
              <button className="confirm-btn-yes" onClick={executeAction}>
                네
              </button>
              <button className="confirm-btn-no" onClick={cancelRent}>
                아니오
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="recommend-header">
        <div className="header-left">
          
          <h2>
            이달의 BEST 책 <span className="month-badge">12월</span>
          </h2>
          <p className="sub-header">
            가장 먼저 책과 만나는 MD들이 자유롭게 좋은 책을 추천합니다.
          </p>
        </div>

        {/* ✅ LiveRanking에서도 대여 버튼이 있다면 onRent/isRented로 연결 가능 */}
        <LiveRanking
          books={books}
          openModal={openModal}
          onRent={handleRent}
          isRented={isRented}
        />
      </header>

      <main>
        <div className="recommend-content">
          <CategorySidebar
            categories={CATEGORIES}
            currentCategory={category}
            onCategoryClick={handleCategoryClick}
          />

          {/* ✅ BookList 내부 대여 버튼을 onRent(book)로 연결하면 됨 */}
          <BookList
            books={books}
            loading={loading}
            category={category}
            openModal={openModal}
            toggleWishlist={toggleWishlist}
            isWished={isWished}
            onRent={handleRent}
            isRented={isRented}
          />
        </div>
        

        {/* ✅ 섹션들도 대여 버튼이 있으면 동일하게 연결 */}
        <AuthorSection
          books={authorBooks}
          openModal={openModal}
          toggleWishlist={toggleWishlist}
          isWished={isWished}
          onRent={handleRent}
          isRented={isRented}
        />

        <MediaSection
          books={mediaBooks}
          openModal={openModal}
          toggleWishlist={toggleWishlist}
          isWished={isWished}
          onRent={handleRent}
          isRented={isRented}
        />

        <BlackSection books={blackBooks} openModal={openModal} />

        <footer className="footer-section">
          2025_OSS _Team_BongShin<br />
          Copyright &copy; BongShin Communication. All Rights Reserved.
        </footer>
      </main>

      {/* ✅ 상세 모달의 대여 버튼은 내부에서 onRent(book) 호출만 하면 됨 */}
      <BookDetailModal
        book={selectedBook}
        onClose={closeModal}
        toggleWishlist={toggleWishlist}
        isWished={isWished}
        onRent={handleRent}
        isRented={isRented}
      />

      <button className="wishlist-sidebar-btn" onClick={() => setIsWishlistOpen(true)}>
        <div className="wishlist-icon-container">
          <span className="wishlist-icon">♥</span>
        </div>
        <div className="wishlist-text-container">
          <span className="wishlist-label">찜</span>
          <span className="wishlist-count">{wishlist.length}</span>
        </div>
      </button>

      {/* ✅ 위시리스트 사이드바에서 대여 버튼도 onRent(book)로 연결 */}
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        onGoMyPage={handleGoMyPage}
        onRent={handleRent}
        isRented={isRented}
      />
    </div>
  </>);
}

export default BookRecommendPage;
