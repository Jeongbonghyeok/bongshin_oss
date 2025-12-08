import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./component/loginComponents/LogMain";
import MainPage from './component/MainComponents/MainPage';
import MyPage from './component/MainComponents/MyPage';

//import MainPage from "./component/MainComponents";

//도서추천서비스 
import BookRecommendPage from "./component/recommendComponents/BookRecommendPage";
//도서추천서비스 import 추가

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* 로그인 페이지 */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* 로그인 성공 후 메인 페이지 : /main/유저id */}
          
          {/* 도서추천 페이지 추가 */}
          <Route path="/recommend/:ID" element={<BookRecommendPage />} />

         
           <Route path="/main/:ID" element={<MainPage/>} />

           <Route path="/mypage/:ID" element={<MyPage/>} />
          {/**
            <Route path="/main/:userId/books/:bookId" element={<BookDetailPage />} />
           * 
           */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
