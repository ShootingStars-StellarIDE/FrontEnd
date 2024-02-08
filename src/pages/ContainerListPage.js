import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
import "../styles/ContainerListPage.css"

function ContainerListPage() {



    return (
        <div className="main-container">
            <div className="sidebar">
                {/* <Sidebar width={200}></Sidebar> */}
                
                {/* 프로필 카드 */}
                <div className="profilecard">
                    <div className="picdisplay">
                        <div className="pic">
                            pic
                        </div>
                        <div className="welcomement">
                            <p>별똥별</p>
                            <p> 님 환영합니다!</p>
                        </div>
                    </div>

                    <div className="profilelink">
                        프로필 바로보기
                    </div>
                </div>
                <hr></hr>
                {/* 컨테이너 스페이스 */}
                <div className="conspace">
                    <p>컨테이너 스페이스</p>
                </div>
                <hr></hr>
                {/* 다이렉트 메시지 */}
                <div className="dmlist">
                    <p>다이렉트 메시지</p>
                </div>
            </div>


            <div className="contents">
                <div className="contents-header">
                    {/* 회원이름/컨테이너 분류 표시 */}
                    <div className="usercon-display">
                        <p>별똥별</p>
                        <p> 님 / 모든 컨테이너</p>
                    </div>

                    {/* 컨테이너 분류 표시 */}
                    <div className="con-display">
                        <p>모든 컨테이너</p>
                    </div>

                    {/* 검색창/정렬 */}
                    <div className="searchbar-line">
                        <p>searchbar</p>
                        {/* <input
                            type="text"
                            id={"searchBox"}
                            placeholder="Search..."
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEnterPress();
                            }}
                            autoComplete={"off"}
                            spellCheck={"false"}
                        />
                        <select
                            id={"sortingType"}
                            value={sortingType}
                            onChange={handleSortingChange}
                            ref={sortingSelectRef}
                        >
                            <option id={"sortingType1"} value="DATE_ASC">Up to Date</option>
                            <option id={"sortingType2"} value="DATE_DESC">Out of Date</option>
                            <option id={"sortingType3"} value="TITLE_ASC">Title ⬆️</option>
                            <option id={"sortingType4"} value="TITLE_DESC">Title ⬇️</option>
                        </select> */}
                    </div>
                </div>

                {/* 컨테이너 목록 */}
                <div className="container-cards">
                        <p>container-cards</p>
                </div>


            </div>
        </div>
    );
}

export default ContainerListPage;