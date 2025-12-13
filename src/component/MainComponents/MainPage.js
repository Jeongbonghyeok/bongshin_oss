import React from 'react';
import {Link} from 'react-router-dom';
import {useState, useRef, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header';


export default function MainPage(){
    const { ID } = useParams(); 

    return(<>
        <Header/>
        <div className="row mt-5 m-5">
            <Link to={`/recommend/${ID}`} className="btn btn-primary col-3 ml-5 me-5">도서추천페이지</Link><br/>
            <Link to={`/mypage/${ID}`} className="btn btn-primary col-3">마이페이지</Link>
        </div>
        
    </>);
}