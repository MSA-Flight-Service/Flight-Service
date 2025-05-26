import {useState} from "react";
import apiClient from "../../apiClient.jsx";

import "./UserManagement.css"

const UserManagement = ({ users, setUsers }) => {
    // 검색 관련 상태 (필요한 검색 필터만 적용)
    const [searchId, setSearchId] = useState("");
    const [searchFirstName, setSearchFirstName] = useState("");
    const [searchLastName, setSearchLastName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    // 편집할 유저 상태
    const [editingUser, setEditingUser] = useState(null);

    // 검색 조건에 따라 유저 필터링 (추가 검색 항목이 필요하면 같이 적용)
    const filteredUsers = users.filter((user) => {
        if (searchId.trim() && !user.id.toString().includes(searchId.trim())) {
            return false;
        }
        if (
            searchFirstName.trim() &&
            !user.userFirstName.toLowerCase().includes(searchFirstName.trim().toLowerCase())
        ) {
            return false;
        }
        if (
            searchLastName.trim() &&
            !user.userLastName.toLowerCase().includes(searchLastName.trim().toLowerCase())
        ) {
            return false;
        }
        if (
            searchEmail.trim() &&
            !user.email.toLowerCase().includes(searchEmail.trim().toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
            date.getDate()
        ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
        ).padStart(2, "0")}`;
    };

    // 입력 변경 핸들러 (일반 텍스트 필드)
    const handleFieldChange = (field) => (e) => {
        setEditingUser({ ...editingUser, [field]: e.target.value });
    };

    // Admin 필드는 체크박스로 처리
    const handleAdminChange = (e) => {
        setEditingUser({ ...editingUser, admin: e.target.checked });
    };

// 수정 폼 제출 시 API 호출하여 업데이트
    const handleUpdateUser = (e) => {
        e.preventDefault();
        apiClient
            .put(`/api/admin/users/${editingUser.id}`, editingUser)
            .then(() => {
                alert("수정 성공!");
                // 업데이트된 유저 정보를 상태에 반영
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === editingUser.id ? editingUser : user
                    )
                );
                setEditingUser(null);
            })
            .catch((error) => {
                console.error("Error updating user:", error);
                alert("Error updating user!");
            });
    };

// 유저 삭제 요청/탈퇴 취소 핸들러:
// 삭제일(deletedAt)이 없으면 삭제(API DELETE) 요청,
// 삭제일이 있는 경우엔 탈퇴 취소(API PUT) 요청하여 삭제일을 null로 업데이트함.
    const handleDeleteOrCancel = (user) => {
        if (user.deletedAt) {
            // 탈퇴 취소: API PUT 요청을 통해 deletedAt 값을 null로 업데이트
            apiClient
                .put(`/api/admin/users/${user.id}/cancelDeletion`)
                .then(() => {
                    alert("탈퇴 취소 성공!");
                    // 상태 업데이트: 해당 유저의 deletedAt을 null로 변경
                    setUsers((prevUsers) =>
                        prevUsers.map((u) =>
                            u.id === user.id ? { ...u, deletedAt: null } : u
                        )
                    );
                })
                .catch((error) => {
                    console.error("Error cancelling deletion:", error);
                    alert("탈퇴 취소 실패!");
                });
        } else {
            // 삭제 요청: API DELETE 요청을 통해 삭제 처리 (서버에서 deletedAt 값을 현재 시간 등으로 업데이트)
            apiClient
                .delete(`/api/admin/users/${user.id}`)
                .then(() => {
                    alert("삭제 요청 성공!");
                    // 상태 업데이트: 해당 유저의 deletedAt 값을 현재 시간(ISO 문자열)으로 설정
                    setUsers((prevUsers) =>
                        prevUsers.map((u) =>
                            u.id === user.id ? { ...u, deletedAt: new Date().toISOString() } : u
                        )
                    );
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    alert("삭제 요청 실패!");
                });
        }
    };

    // 검색 필드 초기화
    const clearSearchFields = () => {
        setSearchId("");
        setSearchFirstName("");
        setSearchLastName("");
        setSearchEmail("");
    };

    return (
        <div className="user-management">
            <h1 className="user-management__title">유저 관리</h1>

            {/* 검색 필터 영역 */}
            <div className="user-management__search">
                <h2 className="user-management__search-title">검색</h2>
                <div className="user-management__search-inputs">
                    <input
                        className="user-management__input"
                        type="text"
                        placeholder="ID 검색"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <input
                        className="user-management__input"
                        type="text"
                        placeholder="이름 검색 (First Name)"
                        value={searchFirstName}
                        onChange={(e) => setSearchFirstName(e.target.value)}
                    />
                    <input
                        className="user-management__input"
                        type="text"
                        placeholder="이름 검색 (Last Name)"
                        value={searchLastName}
                        onChange={(e) => setSearchLastName(e.target.value)}
                    />
                    <input
                        className="user-management__input"
                        type="text"
                        placeholder="이메일 검색"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                    />
                </div>
                <button className="user-management__clear-btn" onClick={clearSearchFields}>
                    초기화
                </button>
            </div>
            {/* 수정 폼 (편집 창) */}
            {editingUser && (
                <form className="user-management__edit-form" onSubmit={handleUpdateUser}>
                    <h2>유저 수정</h2>
                    <div className="user-management__form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            value={editingUser.userFirstName}
                            onChange={handleFieldChange("userFirstName")}
                            placeholder="First Name"
                        />
                    </div>
                    <div className="user-management__form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={editingUser.userLastName}
                            onChange={handleFieldChange("userLastName")}
                            placeholder="Last Name"
                        />
                    </div>
                    <div className="user-management__form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={editingUser.email}
                            onChange={handleFieldChange("email")}
                            placeholder="Email"
                        />
                    </div>
                    <div className="user-management__form-group">
                        <label>비밀 번호</label>
                        <input
                            type="text"
                            value={editingUser.password}
                            onChange={handleFieldChange("password")}
                            placeholder="Password"
                        />
                    </div>
                    <div className="user-management__form-group">
                        <label>핸드폰 번호</label>
                        <input
                            type="text"
                            value={editingUser.phone}
                            onChange={handleFieldChange("phone")}
                            placeholder="Phone"
                            maxLength="11"
                            pattern="\d{11}"
                        />
                    </div>
                    <div className="user-management__form-group">
                        <label>생일</label>
                        <input
                            type="date"
                            value={editingUser.birthday}
                            onChange={handleFieldChange("birthday")}
                            placeholder="Birthday"
                        />
                    </div>
                    <div className="user-management__form-group">
                        <label>가입일</label>
                        <input
                            type="text"
                            value={editingUser.createdAt}
                            onChange={handleFieldChange("createdAt")}
                            placeholder="Created At"
                        />
                    </div>
                    <div className="user-management__form-group">
                        <label>주소</label>
                        <input
                            type="text"
                            value={editingUser.address}
                            onChange={handleFieldChange("address")}
                            placeholder="Address"
                        />
                    </div>
                    <div className="user-management__form-group">
                        <label>Admin</label>
                        <input
                            type="checkbox"
                            checked={editingUser.admin}
                            onChange={handleAdminChange}
                        />
                    </div>
                    <div className="user-management__form-buttons">
                        <button type="submit" className="user-management__update-btn">
                            수정
                        </button>
                        <button
                            type="button"
                            className="user-management__cancel-btn"
                            onClick={() => setEditingUser(null)}
                        >
                            취소
                        </button>
                    </div>
                </form>
            )}
            {/* 유저 목록 테이블 */}
            {filteredUsers.length > 0 ? (
                <table className="user-management__table">
                    <thead>
                    <tr className="user-management__table-header-row">
                        <th className="user-management__table-header">아이디</th>
                        <th className="user-management__table-header">First Name</th>
                        <th className="user-management__table-header">Last Name</th>
                        <th className="user-management__table-header">Email</th>
                        <th className="user-management__table-header">비밀 번호</th>
                        <th className="user-management__table-header">핸드폰 번호</th>
                        <th className="user-management__table-header">생일</th>
                        <th className="user-management__table-header">가입일</th>
                        <th className="user-management__table-header">삭제일</th>
                        <th className="user-management__table-header">주소</th>
                        <th className="user-management__table-header">Admin</th>
                        <th className="user-management__table-header">수정/삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td className="user-management__table-cell">{user.id}</td>
                            <td className="user-management__table-cell">{user.userFirstName}</td>
                            <td className="user-management__table-cell">{user.userLastName}</td>
                            <td className="user-management__table-cell">{user.email}</td>
                            <td className="user-management__table-cell">{user.password}</td>
                            <td className="user-management__table-cell">{user.phone}</td>
                            <td className="user-management__table-cell">{user.birthday}</td>
                            <td className="user-management__table-cell">{formatDateTime(user.createdAt)}</td>
                            <td className="user-management__table-cell">
                                {user.deletedAt ? formatDateTime(user.deletedAt) : "활성"}
                            </td>
                            <td className="user-management__table-cell">{user.address}</td>
                            <td className="user-management__table-cell">
                                {user.admin ? "Yes" : "No"}
                            </td>
                            <td className="user-management__table-cell">
                                <button
                                    className="user-management__edit-btn"
                                    onClick={() => setEditingUser(user)}
                                >
                                    수정
                                </button>
                                {user.deletedAt ? (
                                    <button
                                        className="user-management__cancel-btn"
                                        onClick={() => handleDeleteOrCancel(user)}
                                    >
                                        탈퇴 취소
                                    </button>
                                ) : (
                                    <button
                                        className="user-management__delete-btn"
                                        onClick={() => handleDeleteOrCancel(user)}
                                    >
                                        삭제
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>유저가 없습니다.</p>
            )}
        </div>
    );
};

export default UserManagement;