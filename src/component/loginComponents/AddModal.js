import{useState, useRef} from 'react';
import './Log.css';

const BASE_URL = "https://693133bc11a8738467cda490.mockapi.io/information";

export default function AddModal(){
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isIdValid, setIsIdValid]=useState(false);
    const [ment, setMent] = useState("");

    const userIdRef = useRef(null);
    const passwordRef = useRef(null);
    const nameRef = useRef(null);
    const phoneNumberRef = useRef(null);

    const mentEmpty = () => {
      setMent("");
      setName("");
      setUserId("");
      setPassword("");
      setPhoneNumber("");
    }

    const idCheck = async(e, getId) => { // 아이디가 mock에 존재하는 아이디인지 검사하는 함수
         e.preventDefault();

        if (!userId) {
          setMent("");       
          setIsIdValid(false);
          alert("아이디를 입력해주세요.");
          return;
        }

        try {
            const res = await fetch(BASE_URL);   
            const list = await res.json(); 

            const exists = list.some((u) => u.userId === userId);

            if (exists) {
           
              setMent("이미 존재하는 아이디입니다.");
              setIsIdValid(false);
              setUserId("");
              return false;
            }   
        
             if (!res.ok) {
               alert("로그인 요청 중 오류가 발생했습니다.");
               return false;
             }
        } catch (err) {
          console.error(err);
          alert("통신 중 오류가 발생했습니다.");
        }
        setIsIdValid(true);
        setMent("사용 가능한 ID입니다");
        return true;
    }

   const addNewObject = async () => { // mock api에 정보 추가
  // 1. 아이디 중복검사 안 했거나, 실패한 상태면 막기
      if (!userId) {
        alert("아이디를 입력해주세요.");
        userIdRef.current?.focus();
        return;
      }
      if (!isIdValid) {
        alert("아이디 중복 검사를 먼저 진행해주세요.");
        userIdRef.current?.focus();
        return;
      }
      if (!password) {
        alert("비밀번호를 입력해주세요.");
        passwordRef.current?.focus();
        return;
      }
      if (!name) {
        alert("이름을 입력해주세요.");
        nameRef.current?.focus();
        return;
      }
      if (!phoneNumber) {
        alert("전화번호를 입력해주세요.");
        phoneNumberRef.current?.focus();
        return;
      }

      const newUser = {userId, password, name, phoneNumber, books: []};   
    
      try {
        const res = await fetch(BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });
      
        if (!res.ok) {
          alert("회원 가입 중 오류가 발생했습니다.");
          return;
        }
      
        alert("회원 가입이 완료되었습니다.");
      
        // 3. 입력값 초기화
        setUserId("");
        setPassword("");
        setName("");
        setPhoneNumber("");
        setIsIdValid(false);
        setMent("");
      
      } catch (err) {
        console.error(err);
        alert("통신 중 오류가 발생했습니다.");
      }
    };

    return(<>
        <div className="modal fade" id="exampleModal1">
          <div className="modal-dialog custom-white-modal">
            <div className="modal-content">
              <div className="modal-header" style={{backgroundColor:"white"}}>
                <h1 className="modal-title fs-5" id="exampleModalLabel1" style={{backgroundColor:"white"}}>회원 가입</h1>
              </div>
              <div className="modal-body" style={{backgroundColor:"white"}}>
                 <div className="d-flex flex-column align-items-start" style={{backgroundColor:"white"}}>
                      <input  className="form-control mb-2" ref={userIdRef}  value={userId}  type="text"  placeholder="enter id"  id="userId" 
                       onChange={(e) => {
                        const val = e.target.value;
                        setUserId(val);
                        if(val===""){
                          setMent("");
                          setIsIdValid(false);
                        }
                      }}/>
                      <p className="col-6 text-start"  style={ment === "" ? {} : isIdValid ? { color: "green" }: { color: "red" } }>{ment}</p>
                      <button className="btn btn-primary mb-4"  onClick={idCheck} > 중복 검사</button>
                      <input className="form-control mb-4 " ref={passwordRef} value={password} type="text" placeholder="password" id="password" onChange={(e)=>{setPassword(e.target.value)}}/>
                      <input className="form-control mb-4" ref={nameRef} value={name} type="text" placeholder="name" id="name" onChange={(e)=>{setName(e.target.value)}}/>
                      <input className="form-control mb-4" ref={phoneNumberRef} value={phoneNumber} type="number" placeholder="phoneNumber" id="phoneNumber" onChange={(e)=>{setPhoneNumber(e.target.value)}}/>
                  </div>
              </div>
              <div className="modal-footer">
                <button data-bs-dismiss="modal" className="btn btn-primary" onClick={mentEmpty}>Close</button>
                <button type="button" className="btn btn-primary" onClick={addNewObject} data-bs-dismiss="modal">Add Student</button>
              </div>
            </div>
          </div>
      </div>
    </>);
}