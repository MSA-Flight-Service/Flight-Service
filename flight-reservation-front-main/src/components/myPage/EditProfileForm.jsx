import { useState } from "react";

import "./EditProfileForm.css"

function EditProfileForm({ user, onCancel, onSave }) {
    const [editedUser, setEditedUser] = useState(user);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({
            ...prev,
            [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 11) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editedUser);

    };

    return (
        <div className="edit-profile">
            <h2>내 정보 수정</h2>
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="form-group">
                    <label>이메일</label>
                    <input type="email" value={editedUser.email} disabled />
                </div>
                <div className="form-row">
                    <div className="form-group first-name">
                        <label>이름</label>
                        <input
                            name="userFirstName"
                            value={editedUser.userFirstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group last-name">
                        <label>성</label>
                        <input
                            name="userLastName"
                            value={editedUser.userLastName}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>전화번호</label>
                    <input name="phone" value={editedUser.phone} onChange={handleChange} maxLength="11" />
                </div>
                <div className="form-group">
                    <label>생년월일</label>
                    <input type="date" name="birthday" value={editedUser.birthday || ""} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>주소</label>
                    <input name="address" value={editedUser.address || ""} onChange={handleChange} />
                </div>
                <div className="edit-button-group">
                    <button type="submit">저장</button>
                    <button type="button" onClick={onCancel}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default EditProfileForm;
