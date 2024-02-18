import React, { useState, useEffect } from "react";
import * as auth from "../apis/auth";
// import { useParams, useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/ContainerListPage.css"
import "../styles/Sidebar.css"
import "../styles/ContainerList.css"
import "../styles/UserProfile.css"


import ContainerModal from "../components/ContainerList/ContainerModal";
import "../styles/ContainerModal.css"

import Sidebar from "../components/ContainerList/Sidebar";
import ContainerList from "../components/ContainerList/ContainerList";
import ChatBubble from "../components/ContainerList/ChatBubble";

function ContainerListPage() {

    const navigate = useNavigate();
    
    const cards = [
        '첫 번째 아이템', 
        '두 번째 아이템', 
        '세 번째 아이템', 
        '네 번째 아이템'
    ];

    const dmusers = ['IU', 'Jungkook', 'Eunha', 'Eunji'];

    const [isModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    return (
        <div className="main-container">
            <Sidebar>

            </Sidebar>

            <ContainerList>
                
            </ContainerList>

            <ChatBubble>
                
            </ChatBubble>

            {/* <ContainerModal isOpen={isModalOpen} onClose={toggleModal} /> */}
            
        </div>
    );
}

export default ContainerListPage;