import React from "react";
import {useState, useRef, useEffect} from 'react';
import { useParams } from "react-router-dom";
import{Link} from "react-router-dom"
import Header from "../Header";
import './MyPage.css'


const MOCK_URL = "https://693133bc11a8738467cda490.mockapi.io/information";
const API_KEY = "AIzaSyA1Oo9pmCtewgLXwy8fcxHpd4V9YXRzFKM"; 

export default function MyPage(){
    const [information, setInformation] = useState(null);
    const [bookIds, setBookIds] = useState([]);
    const [bookDetails, setbookDetails] = useState([]); // API로 끌어온 책 객체 배열
    const { ID } = useParams();

    useEffect(()=>{
        getMyInformation();
    },[ID])

    useEffect(()=>{
        getBookInformations();
    }, [bookIds])

    const getMyInformation = async () => {
      if (!ID) return;

      try {
        const res = await fetch(`${MOCK_URL}/${ID}`);
        if (!res.ok) throw new Error("failed to fetch my info");

        const user = await res.json();

        setInformation(user);           // 내 정보 저장
        setBookIds(user.books || []);     // mock에 저장된 책 id 배열도 같이 세팅(편함)
      } catch (e) {
        console.error(e);
      }
    };


   const getBookInformations = async () => {
     if (bookIds.length === 0) {
       setbookDetails([]);
       return;
     }
 
     try {
       const results = await Promise.all(
         bookIds.map(async (bookId) => {
           const r = await fetch(
             `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`
           );
           if (!r.ok) return null;
           return await r.json();
         })
       );
     
       setbookDetails(results.filter(Boolean));
     } catch (e) {
       console.error(e);
       setbookDetails([]);
     }
    };

    const showMyInformation = (infor) => {

        return(<>
            <div className="text-start mt-5 mb-5 userInfor">
               <h5><span>성명: </span>{infor.name}</h5>
               <h5><span>아이디: </span>{infor.userId}</h5>
               <h5><span>전화번호: </span>{infor.phoneNumber}</h5>
            </div>
            
        </>);
    }

    //책 정보 보여주는 함수
    const showBookDetails = (book)=>{
        
        const info = book.volumeInfo || {};
        const sale = book.saleInfo || {};
        const access = book.accessInfo || {};

        const thumbnail =
          info.imageLinks?.thumbnail?.replace("http:", "https:") ||
          info.imageLinks?.smallThumbnail?.replace("http:", "https:");

        const published = info.publishedDate || "출간일 정보 없음";
        const publisher = info.publisher || "출판사 정보 없음";
        const categories = info.categories?.join(" / ") || "카테고리 정보 없음";
        const pageCount = info.pageCount ? `${info.pageCount}p` : "페이지 정보 없음";
        const rating = info.averageRating
          ? `${info.averageRating} ⭐ (${info.ratingsCount || 0})`
          : "평점 정보 없음";

        const price =
          sale?.listPrice?.amount
            ? `${sale.listPrice.amount} ${sale.listPrice.currencyCode || ""}`
            : null;

        return (
          <div key={book.id} className="col-12 col-lg-6 d-flex">
             <div className="book-card row g-0 flex-fill">
                <div className="book-thumb-wrapper col-5 mt-3">
                  {thumbnail ? (
                    <img className="book-thumb" src={thumbnail} alt={info.title || "book"} />
                  ) : (
                    <div className="book-thumb placeholder">No Image</div>
                  )}

                   <div className="book-card-footer">
                      {info.infoLink && (
                        <a href={info.infoLink} target="_blank" rel="noreferrer" className="book-detail-link">
                          자세히 보기 
                        </a> 
                      )}
                       <br/>
                      {access?.webReaderLink && (
                        <a href={access.webReaderLink} target="_blank" rel="noreferrer" className="book-detail-link mt-2">
                          미리보기
                        </a>
                      )}
                    </div>
                </div>
                <div className="col-6 mb-4 mt-4 p-3 book-info-pane justify-content-end">
                    <div className="book-card-body">
                        <h3 className="book-card-title">{info.title || "제목 없음"}</h3>
                        <p className="book-card-author">{info.authors?.join(", ") || "저자 미상"}</p>

                        <div className="book-meta">
                          <p>출간일: {published}</p>
                          <p>출판사: {publisher}</p>

                          <p>페이지: {pageCount}</p>
                          <p>평점: {rating}</p>
                          {price && <p>가격: {price}</p>}
                          {info.language && <p>언어: {info.language}</p>}
                        </div>
                    </div>
                </div>
             </div>
          </div>
        );
    }




    return(<>
        <Header/>
        <div className="row justify-content-end m-3 mypage">
            <Link to={`/main/${ID}`} className="btn btn-primary col-1 m-2">뒤로가기</Link><br/>
            <Link to="/login" className="btn btn-primary col-1 m-2">로그아웃</Link>
        </div>
        <div className="container mypage">
            <hr/>
            <div id="myInfor" className="justify-content-start">
                <h2 className="text-start">내 정보</h2>
                <div className="userInfor">
                    {information && showMyInformation(information)}
                </div>
            </div>
            <hr/>
            <div id ="bookInfor">
                <h2 className="text-start mb-5 mt-4">대여 도서</h2>
                <div className="book-grid row mt-4">
                  {bookDetails.map(showBookDetails)}
                </div>
            </div>
        </div>
        <div className="mb-5"></div>
    </>)
}