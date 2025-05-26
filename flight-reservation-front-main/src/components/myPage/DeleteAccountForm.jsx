import {useState} from "react";
import "./DeleteAccountForm.css"

function DeleteAccountForm({ userEmail, onCancel, onConfirm }) {
    const [inputEmail, setInputEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(inputEmail);
    };

    return (
        <div className="delete-account-form">
            <h2>회원 탈퇴</h2>
            <p>계정을 삭제하려면 아래에 이메일을 입력해주세요.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>이메일 확인</label>
                    <input
                        type="email"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        placeholder="이메일 입력"
                        required
                    />
                </div>
                <div className="delete-button-group">
                    <button type="submit">탈퇴하기</button>
                    <button type="button" onClick={onCancel}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default DeleteAccountForm;
