import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./component/loginComponents/LogMain";
//import MainPage from "./component/MainComponents";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* 로그인 페이지 */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* 로그인 성공 후 메인 페이지 : /main/유저id */}
          {/**
           *<Route path="/main/:userId" element={<MainPage />} />
          
            <Route path="/main/:userId/books/:bookId" element={<BookDetailPage />} />
           * 
           */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
