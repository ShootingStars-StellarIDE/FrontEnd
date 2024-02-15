import React from "react";
import { useNavigate } from "react-router-dom";

function UserProfile() {

    const navigate = useNavigate();

    return (
        <div className="contents">
            <div className="contents-header">
                <div className="user-profile-display">
                    <p>별똥별</p>
                    <p>님 / 프로필</p>
                </div>
            </div>

            <div className="profile-card">
                <div className="profile-image-placeholder"></div>
                <div className="profile-info">
                    <p className="title">닉네임</p>
                    <p className="info">별똥별</p>
                    <p className="title">계정</p>
                    <p className="info">Shootingstar@groom.co.kr</p>
                    <p className="title">비밀번호 수정</p>
                    <input
                        className="password-input"
                        type="text"
                        placeholder="비밀번호를 입력해주세요"
                    />
                    <p className="title">내 컨테이너 개수</p>
                    <p className="info">3개</p>
                    <p className="title">공유 컨테이너 개수</p>
                    <p className="info">7개</p>
                    <button className="edit-button">회원정보 수정</button>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;