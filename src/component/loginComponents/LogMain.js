import {Link, useNavigate} from 'react-router-dom'
import {useState, useRef, useEffect} from 'react';
import AddModal from './AddModal';


const BASE_URL = "https://693133bc11a8738467cda490.mockapi.io/information";

export default function LogMain(){
    const [inputId, setInputId] = useState("");
    const [inputPw, setInputPw] = useState("");
    const [informations, setInformations] = useState([]);
     const navigate = useNavigate();

    const isLogIn = async (e) => {
        e.preventDefault();

        if (!inputId || !inputPw) {
          alert("아이디와 비밀번호를 모두 입력해주세요.");
          return;
        }

        try {
          // 1) userId로 유저 조회
          const res = await fetch(
            `${BASE_URL}?userId=${encodeURIComponent(inputId)}`
          );

          if (!res.ok) {
            alert("로그인 요청 중 오류가 발생했습니다.");
            return;
          }

          const list = await res.json();
          setInformations(list); 

        
          if (list.length === 0) {
            alert("존재하지 않는 아이디입니다.");
            return;
          }

          const user = list[0]; // userId를 유일하게 관리한다고 가정

          // 3) 비밀번호 확인
          if (user.password !== inputPw) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
          }

         
          setInputId("");
          setInputPw("");

          navigate(`../MainComponents/Main.js/${user.userId}`, {
            state: { user }, 
          });
        } catch (err) {
          console.error(err);
          alert("통신 중 오류가 발생했습니다.");
        }
    };
    
    return(<>  
        <div>
            <h1 className="justify-content-center mt-5">로그인</h1>
        </div>
        <div className="container mx-auto">
            <div className = "row justify-content-center">
                <form className="col-6 row mt-5">
                    <input className="form-control col-12 mb-3" id='loginId' type='text' placeholder="ID" value={inputId} onChange={(e)=>{setInputId(e.target.value)}}/><br/><br/>
                    <input className = "form-control col-12 mb-3" id='loginPw' type='password' placeholder='password' value={inputPw} onChange={(e)=>{setInputPw(e.target.value)}}/>
                    <input type="submit" className="btn btn-primary col-12" value="login" onClick={isLogIn}/>
                </form>
                <div className ="row justify-content-center mt-4">
                    <div className="col-6 row">
                        <p className="col-6"  data-bs-toggle="modal" data-bs-target="#exampleModal1" style={{color:"gray"}}>회원가입</p>
                        <p className="col-6" style={{color:"gray"}}>아이디 / 비밀번호 찾기</p>
                    </div>
                </div>
            </div>
        </div>
        <AddModal />
    </>);
}