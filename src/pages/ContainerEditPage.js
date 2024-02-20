import React, { useEffect, useState } from "react";
import FolderTree from "react-folder-tree";
import Editor from "@monaco-editor/react";
import ChatBubble from "../components/ContainerList/ChatBubble";
import { useParams } from "react-router-dom";

import "../styles/ContainerEditPage.css";
import axios from "axios";

function ContainerEditPage() {
  const params = useParams();

  // 임시 트리 데이터
  const treeData = {
    name: "React",
    children: [
      { name: "node_modules" },
      { name: "public" },
      { name: "package.json" },
      {
        name: "src",
        children: [
          { name: "App.js" },
          { name: "App.css" },
          { name: "index.js" },
        ],
      },
      { name: "한글", children: [{ name: "파일.js" }, { name: "파일.md" }] },
    ],
  };

  // 파일 트리
  const BasicTree = () => {
    const onTreeStateChange = (state, event) => console.log(state, event);
    return (
      <FolderTree
        data={treeData}
        showCheckbox={false}
        onChange={onTreeStateChange}
        readOnly
        onNameClick={onNameClick}
      />
    );
  };

  const [editors, setEditors] = useState([]);

  // 파일 클릭하면 파일 이름으로 탭 생성
  const onNameClick = ({ nodeData }) => {
    const { path, name, nickname, url } = nodeData;

    const newEditor = {
      label: name,
      content: (
        <Editor
          key={name}
          width="100%"
          height="60vh"
          theme="vs-dark"
          defaultLanguage="javascript"
          defaultValue={"// some comment"}
        />
      ),
    };
    setEditors((prevEditors) => [...prevEditors, newEditor]);
  };

  // 탭
  function Tab({ label, isActive, onClick, onClose }) {
    return (
      <div className={`tab ${isActive ? "active" : ""}`} onClick={onClick}>
        {label}
        <button
          className="close-tab"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          x
        </button>
      </div>
    );
  }

  function Tabs({ children }) {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
      setActiveTab(index);
    };

    const tabs = React.Children.toArray(children).map((child, index) => {
      return React.cloneElement(child, {
        isActive: index === activeTab,
        onClick: () => handleTabClick(index),
      });
    });

    return (
      <div className="tabs">
        <div className="tab-list">{tabs}</div>
        {tabs.length > 0 && (
          <div className="tab-panel">{tabs[activeTab].props.children}</div>
        )}
      </div>
    );
  }

  const handleCloseTab = (index) => {
    setEditors((prevEditors) => prevEditors.filter((_, i) => i !== index));
  };

  //----------------------------------------------------------------chat

  return (
    <div className="edit-page">
      <div className="tree-container">
        <div className="tree-bar">트리바</div>
        <div className="tree-main">
          <BasicTree />
        </div>
      </div>
      <div className="editor-container">
        <div className="editor-bar">
          <Tabs>
            {editors.map((editor, index) => (
              <Tab
                key={index}
                label={editor.label}
                onClose={() => handleCloseTab(index)}
              >
                <div className="editor-main">{editor.content}</div>
              </Tab>
            ))}
          </Tabs>
        </div>
        <div className="result">결과창</div>
      </div>
      {/* <ChatBubble containerId={params.containerId} /> */}
    </div>
  );
}

export default ContainerEditPage;
