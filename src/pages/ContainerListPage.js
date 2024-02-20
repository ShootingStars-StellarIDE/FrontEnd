import React, { useState } from "react";
import "../styles/ContainerListPage.css";
import "../styles/Sidebar.css";
import "../styles/ContainerList.css";
import "../styles/UserProfile.css";

import ContainerModal from "../components/ContainerList/ContainerModal";
import "../styles/ContainerModal.css";

import Sidebar from "../components/ContainerList/Sidebar";
import ContainerList from "../components/ContainerList/ContainerList";

import ChatBubbleGlobal from "../components/ContainerList/ChatBubbleGlobal";

function ContainerListPage() {

  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div className="main-container">
      <Sidebar></Sidebar>

      <ContainerList></ContainerList>

      {/* <ChatBubbleGlobal /> */}

      {/* <ContainerModal isOpen={isModalOpen} onClose={toggleModal} /> */}
    </div>
  );
}

export default ContainerListPage;
