  import React, { useState, useEffect, useRef } from "react";
  import { useParams } from "react-router-dom";
  import {Link} from 'react-router-dom';
  import Header from "../Header";


  const API_KEY = "AIzaSyA1Oo9pmCtewgLXwy8fcxHpd4V9YXRzFKM"; 
  const MOCK_API = "https://693133bc11a8738467cda490.mockapi.io/information";

  const CATEGORIES = [
    { name: "베스트셀러", query: "bestseller" },
    { name: "소설", query: "fiction" },
    { name: "자기계발", query: "self-help" },
    { name: "과학", query: "science" },
    { name: "IT/프로그래밍", query: "programming" },
    { name: "경제/경영", query: "business" },
  ];

  function BookRecommendPage() {
    const [books, setBooks] = useState([]);
    const [category, setCategory] = useState("베스트셀러");
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [information, setinformation] = useState(null);
  
    const { ID } = useParams(); // 넘어온 userId

    const didMount = useRef(false);
    const hydrated = useRef(false); // 다시 왔을 때 이전에 있던 정보 컨트롤하기 위함

    console.log("params ID =", ID);

    //첫 실행 때 이전 book 저장 목록덮지 않도록
    useEffect(() => {
      if (!didMount.current) {
        didMount.current = true;
        return;
      }
      updateBooksToMock(favorites);
    }, [favorites, ID]);

    const getMyInformation = async () => {
      if (!ID) return;

      const res = await fetch(`${MOCK_API}/${ID}`);
      const user = await res.json();

      setFavorites(user.books || []);   // ✅ 핵심
      hydrated.current = true;          // ✅ 이제부터 저장 허용
    };

    useEffect(() => {
      getMyInformation();
    }, [ID]);

  /*
    const updateBooksToMock = async (nextFavorites) => {
      if (!ID) return;

      try {
        // books에 favorites 배열 통째로 저장
        await fetch(`${MOCK_API}/${ID}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ books: nextFavorites }),
          
        });
        alert("성공");
      } catch (e) {
        console.error("mock books 업데이트 실패:", e);
        alert("실패");
      }
    };

*/
   const updateBooksToMock = async (nextFavorites) => {
      if (!ID) return;

      try {
        // 1) 기존 유저 데이터 가져오기
        const res = await fetch(`${MOCK_API}/${ID}`);
        const user = await res.json();
      
        // 2) books만 교체한 새 객체 만들기
        const nextUser = { ...user, books: nextFavorites };
      
        // 3) PUT으로 전체 업데이트
        const putRes = await fetch(`${MOCK_API}/${ID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextUser),
        });
      
        if (!putRes.ok) throw new Error("PUT failed");
      
        // alert("성공");
      } catch (e) {
        console.error(e);
        // alert("실패");
      }
    };


    const fetchBooks = async (query) => {
      if (!API_KEY) {
        console.error("Google Books API key is missing");
        return;
      }

      setLoading(true);
      try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=20&key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        setBooks(data.items || []);
      } catch (err) {
        console.error("도서 검색 오류:", err);
        setBooks([]);
      }
      setLoading(false);
    };

    // 처음 로딩 시
    useEffect(() => {
      fetchBooks("bestseller");
    }, []);

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      fetchBooks(searchQuery);
      setCategory("검색 결과");
    };

    const handleCategoryClick = (cat) => {
      setCategory(cat.name);
      fetchBooks(cat.query);
    };

    const toggleFavorite = (bookId) => {
      setFavorites((prev) =>
        prev.includes(bookId)
          ? prev.filter((id) => id !== bookId)
          : [...prev, bookId]
      );
    };

    return (<>
      <Header/>
      <Link to={`/main/${ID}`} className="btn btn-primary">뒤로가기</Link><br/>
      <div className="book-page">
        {/* 상단 헤더 */}
        <header className="book-header">
          <div>
            <h1 className="book-title">도서 추천 서비스</h1>
            <p className="book-subtitle">
              Google Books API를 활용한 온라인 도서관 추천 페이지입니다.
            </p>
          </div>
          <div className="favorite-badge">
            ❤️ <span>{favorites.length}</span> 권 대여함
          </div>
        </header>

        {/* 검색 영역 */}
        <section className="book-search-section">
          <form onSubmit={handleSearchSubmit} className="book-search-form">
            <input
              type="text"
              placeholder="읽고 싶은 책 제목, 저자를 입력해 보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="book-search-input"
            />
            <button type="submit" className="book-search-button">
              검색
            </button>
          </form>
        </section>

        {/* 카테고리 탭 */}
        <section className="book-category-section">
          {CATEGORIES.map((cat) => (
            <button key={cat.name} onClick={() => handleCategoryClick(cat)} 
            className={category === cat.name ? "category-chip active" : "category-chip" }>{cat.name}</button>
          ))}
        </section>

        {/* 결과 헤더 */}
        <div className="book-result-header">
          <h2>
            <span className="highlight">"{category}"</span> 추천 도서
          </h2>
          <span className="result-count">총 {books.length}권</span>
        </div>

        {/* 도서 카드 그리드 */}
        <section className="book-grid-section">
          {loading ? (
            <div className="book-loading">도서를 불러오는 중입니다...</div>
          ) : books.length === 0 ? (
            <div className="book-empty">
              검색 결과가 없습니다. 다른 키워드나 카테고리를 선택해 주세요.
            </div>
          ) : (
            <div className="book-grid">
              {books.map((book) => {
                const info = book.volumeInfo;
                const isFavorite = favorites.includes(book.id);

                return (
                  <div key={book.id} className="book-card">
                    <div className="book-thumb-wrapper">
                      {info.imageLinks?.thumbnail ? (
                        <img
                          className="book-thumb"
                          src={info.imageLinks.thumbnail.replace(
                            "http:",
                            "https:"
                          )}
                          alt={info.title}
                        />
                      ) : (
                        <div className="book-thumb placeholder">No Image</div>
                      )}

                      <button
                        type="button"
                        className={
                          isFavorite ? "favorite-button on" : "favorite-button"
                        }
                        onClick={() => toggleFavorite(book.id)}
                      >
                        대여
                      </button>
                    </div>

                    <div className="book-card-body">
                      <h3 className="book-card-title">{info.title}</h3>
                      <p className="book-card-author">
                        {info.authors?.join(", ") || "저자 미상"}
                      </p>
                      <p className="book-card-desc">
                        {info.description
                          ? info.description.slice(0, 90) + "..."
                          : "도서 설명이 없습니다."}
                      </p>
                    </div>

                    <div className="book-card-footer">
                      {info.infoLink && (
                        <a href={info.infoLink} target="_blank" rel="noreferrer" className="book-detail-link">자세히 보기</a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>);
  }

  export default BookRecommendPage;
