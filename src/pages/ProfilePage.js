import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css"
import "../styles/UserProfile.css"
import "../styles/ContainerListPage.css"

import Sidebar from "../components/Sidebar";
import UserProfile from "../components/UserProfile";
import ChatBubble from "../components/ChatBubble";

function ProfilePage() {

    const navigate = useNavigate();

    return (
        <div className="main-container">
            <Sidebar>

            </Sidebar>

            <UserProfile>
                
            </UserProfile>

            <ChatBubble>
                
            </ChatBubble>
        </div>
    );
}
  
export default ProfilePage;