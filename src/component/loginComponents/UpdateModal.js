import { useState, useRef } from "react";

const BASE_URL = "https://693133bc11a8738467cda490.mockapi.io/information";

export default function UpdateModal() {
  const [userId, setUserId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");

  const userIdRef = useRef(null);
  const phoneRef = useRef(null);
  const newPwRef = useRef(null);
  const newPw2Ref = useRef(null);

  const resetAll = () => {
    setUserId("");
    setPhoneNumber("");
    setNewPw("");
    setNewPw2("");
  };

 

  const updatePassword = async () => {
    if (!userId) {
      alert("아이디를 입력해주세요.");
      userIdRef.current?.focus();
      return;
    }
    if (!phoneNumber) {
      alert("전화번호를 입력해주세요.");
      phoneRef.current?.focus();
      return;
    }
    if (!newPw) {
      alert("새 비밀번호를 입력해주세요.");
      newPwRef.current?.focus();
      return;
    }
    if (!newPw2) {
      alert("새 비밀번호 확인을 입력해주세요.");
      newPw2Ref.current?.focus();
      return;
    }
    if (newPw !== newPw2) {
      alert("새 비밀번호가 서로 일치하지 않습니다.");
      newPw2Ref.current?.focus();
      return;
    }

    try {
      // 1) userId로 유저 찾기
      const res = await fetch( `${BASE_URL}?userId=${encodeURIComponent(userId)}`);

      if (!res.ok) {
        alert("조회 중 오류가 발생했습니다.");
        return;
      }

      const list = await res.json();

      if (list.length === 0) {
        alert("존재하지 않는 아이디입니다.");
        return;
      }

      const user = list[0];
      alert(user.id);

      // 2) 본인 확인(전화번호)
      if (String(user.phoneNumber) !== String(phoneNumber)) {
        alert("전화번호가 일치하지 않습니다.");
        return;
      }

      // 3) mockapi의 실제 id로 PUT
      const updateRes = await fetch(`${BASE_URL}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPw }),
      });

      if (!updateRes.ok) {
        alert("비밀번호 변경 중 오류가 발생했습니다.");
        return;
      }

      alert("비밀번호 변경이 완료되었습니다.");
      const modalEl = document.getElementById("exampleModal2");
      if (modalEl && window.bootstrap) {
        const modal =
        window.bootstrap.Modal.getInstance(modalEl) ||
        new window.bootstrap.Modal(modalEl);
        modal.hide();
      }
      resetAll();
    } catch (err) {
      console.error(err);
      alert("통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="modal fade" id="exampleModal2">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header" style={{backgroundColor:"white"}}>
              <h1 className="modal-title fs-5" style={{backgroundColor:"white"}}>비밀번호 변경</h1>
            </div>

            <div className="modal-body" style={{backgroundColor:"white"}}>
              <div className="d-flex flex-column align-items-start" style={{backgroundColor:"white"}}>
                <input
                  className="form-control mb-3"
                  ref={userIdRef}
                  value={userId}
                  type="text"
                  placeholder="enter id"
                  onChange={(e) => setUserId(e.target.value)}
                />

                <input
                  className="form-control mb-3"
                  ref={phoneRef}
                  value={phoneNumber}
                  type="number"
                  placeholder="enter phoneNumber"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <input
                  className="form-control mb-3"
                  ref={newPwRef}
                  value={newPw}
                  type="password"
                  placeholder="new password"
                  onChange={(e) => setNewPw(e.target.value)}
                />

                <input
                  className="form-control mb-3"
                  ref={newPw2Ref}
                  value={newPw2}
                  type="password"
                  placeholder="confirm new password"
                  onChange={(e) => setNewPw2(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button   data-bs-dismiss="modal"   className="btn btn-secondary" onClick={resetAll} > Close </button>
              <button  type="button"  className="btn btn-primary"  onClick={updatePassword} >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
