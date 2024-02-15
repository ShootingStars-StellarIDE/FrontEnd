import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const goToProfile = () => {
        navigate(`/dashboard/profile`);
    };

    const goToContainerList = () => {
        navigate(`/dashboard/containers`);
    };

    const DmUserClick = () => {
        alert("dm창 띄우기");
    };

    const dmusers = ['IU', 'Jungkook', 'Eunha', 'Eunji'];

    return (

        <div className="sidebar">
            {/* 프로필 카드 */}
            <div className="profilecard">
                <div className="picdisplay">
                    <div className="pic"
                        onClick={goToProfile}
                    >
                        <img src="https://exp.goorm.io/_next/image?url=https%3A%2F%2Fexp-upload.goorm.io%2F2023-11-13%2FN%2FN20D3vbX1qrGSyOcnU.webp&w=96&q=75" />
                    </div>
                    <div className="welcomement">
                        <p>별똥별 님</p>
                        <p>환영합니다!</p>
                    </div>
                </div>
            </div>

            {/* 컨테이너 스페이스 */}
            <div className="conspace">
                <details open>
                    <summary>스페이스</summary>
                    <div onClick={goToContainerList}>모든 컨테이너</div>
                    <div>내 컨테이너</div>
                    <div>공유 컨테이너</div>
                </details>

            </div>

            {/* 다이렉트 메시지 */}
            <div className="dmlist">
                <details open>
                    <summary>DM</summary>
                    {dmusers.map((dmuser, dmlistkey) => (
                        <div key={dmlistkey} onClick={DmUserClick}>
                            <img src="https://exp.goorm.io/_next/image?url=https%3A%2F%2Fexp-upload.goorm.io%2F2023-11-13%2FN%2FN20D3vbX1qrGSyOcnU.webp&w=96&q=75" />
                            <p>{dmuser}</p>
                        </div>
                    ))}
                </details>
            </div>
        </div>

    );
}

export default Sidebar;