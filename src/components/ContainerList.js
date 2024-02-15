// import React from "react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContainerModal from "./ContainerModal";


function ContainerList() {

    const navigate = useNavigate();

    const cards = [
        '첫 번째 아이템',
        '두 번째 아이템',
        '세 번째 아이템',
        '네 번째 아이템'
    ];

    const handleFirstItemClick = () => {
        alert("첫 번째 아이템이 클릭되었습니다!");
    };

    const CardStartClick = () => {
        alert("모달창 띄움");
    };

    // const [isModalOpen, setModalOpen] = useState(false);
    // const toggleModal = () => {
    //     setModalOpen(!isModalOpen);
    // };

    const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

    return (
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
                    <div class="search">
                        <input
                            type="text"
                            placeholder="검색어 입력"
                        // value={inputValue}
                        // onChange={handleInputChange}
                        // onKeyDown={(e) => {
                        //     if (e.key === 'Enter') handleEnterPress();
                        // }}
                        // autoComplete={"off"}
                        // spellCheck={"false"}
                        />
                        <img src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png" />
                    </div>

                    <select
                    // id={"sortingType"}
                    // value={sortingType}
                    // onChange={handleSortingChange}
                    // ref={sortingSelectRef}
                    >
                        <option id={"sortingType1"} value="DATE_ASC">날짜 오름차순</option>
                        <option id={"sortingType2"} value="DATE_DESC">날짜 내림차순</option>
                        <option id={"sortingType3"} value="TITLE_ASC">이름 오름차순</option>
                        <option id={"sortingType4"} value="TITLE_DESC">이름 내림차순</option>
                    </select>
                </div>
            </div>

            {/* 컨테이너 목록 */}
            <div className="container-cards">
                {/* 컨테이너 추가 */}
                <div onClick={handleFirstItemClick}>
                    +
                </div>

                {cards.map((card) => (
                    <div className="concards" key={card.id}>
                        <div className="conname">{card}</div>
                        <div className="idelang">언어</div>
                        <div className="space"></div>
                        {/* <div className="idestart" onClick={toggleModal}>시작하기</div> */}
                        <div className="idestart" onClick={openModal}>시작하기</div>
                        <ContainerModal isOpen={isOpen} close={closeModal} />
                    </div>
                ))}


            </div>

        </div>
    );
}

export default ContainerList;