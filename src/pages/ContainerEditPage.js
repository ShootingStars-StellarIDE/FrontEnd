import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import yorkie from "yorkie-js-sdk";

import { ToggleButton } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ChatBubble from "../components/ContainerList/ChatBubble";

import "../styles/ContainerEditPage.css";

// Yorkie
async function initYorkie() {
  const client = new yorkie.Client("https://api.yorkie.dev", {
    apiKey: "cn7m65tafcg8gj9icml0",
  });
  await client.activate();
  const doc = new yorkie.Document("editor-doc");

  await client.attach(doc, {
    initialPresence: {
      name: "사용자",
    },
  });

  return { client, doc };
}

function ContainerEditPage() {
  const params = useParams();

  const [treeWidth, setTreeWidth] = useState("20%");
  const [resultHeight, setResultHeight] = useState("30%");
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const minTreeWidth = 100;
  const minResultHeight = 100;

  const [treeData, setTreeData] = useState("");
  const [fileData, setFileData] = useState("");

  const [editors, setEditors] = useState([]);
  const editorRef = useRef(null);

  const [editorValue, setEditorValue] = useState("");
  const [yorkieDoc, setYorkieDoc] = useState(null);
  const [editing, setEditing] = useState(0);
  const [editingUser, setEditingUser] = useState("");

  const token = localStorage.getItem("Authorization");

  // 임시 트리 데이터
  const treeTemp = {
    name: "dnjs2721_javaTest",
    type: "directory",
    children: [
      {
        name: "bin",
        type: "directory",
        children: [],
      },
      {
        name: "src",
        type: "directory",
        children: [
          {
            name: "project",
            type: "directory",
            children: [
              {
                name: "Main.java",
                type: "file",
              },
              {
                name: "test.java",
                type: "file",
              },
            ],
          },
        ],
      },
    ],
  };

  // 임시 파일 데이터
  const fileTemp = {
    content: "임시 데이터",
  };

  // 파일 트리
  const Tree = ({ data }) => {
    return <TreeItem item={data} />;
  };

  const TreeItem = ({ item }) => {
    // 디렉토리인 경우, 재귀적으로 TreeItem 컴포넌트를 호출
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    if (item.type === "directory") {
      return (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={toggleCollapse}
              size="small"
              sx={{
                color: "white",
              }}
            >
              {isCollapsed ? <ChevronRightIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <FolderIcon
              fontSize="small"
              sx={{
                color: "white",
                marginRight: "8px",
              }}
            />
            <span
              style={{ cursor: "pointer" }}
              onClick={() => onNameClick(item)}
            >
              {item.name}
            </span>
          </div>
          {!isCollapsed && (
            <div style={{ paddingLeft: "30px", marginTop: "-8px" }}>
              {item.children.map((child, index) => (
                <TreeItem key={index} item={child} />
              ))}
            </div>
          )}
        </div>
      );
    }
    // 파일인 경우
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          paddingTop: "8px",
          paddingLeft: "10px",
        }}
        onClick={() => onNameClick(item)}
      >
        <InsertDriveFileIcon
          fontSize="small"
          sx={{
            color: "white",
            marginRight: "8px",
          }}
        />
        {item.name}
      </div>
    );
  };

  // path 속성 추가
  const addPathToTree = (node, parentPath = "") => {
    // 현재 노드의 경로를 계산
    const currentPath =
      parentPath === "" ? node.name : `${parentPath}/${node.name}`;

    // 현재 노드에 path 속성 추가
    node.path = currentPath;

    // 현재 노드가 디렉토리라면, 자식 노드들에 대해서도 재귀적으로 함수 호출
    if (node.type === "directory" && node.children) {
      node.children.forEach((child) => addPathToTree(child, currentPath));
    }
  };
  addPathToTree(treeTemp);

  // 파일, 디렉토리 클릭
  const onNameClick = (item) => {
    const { name, type, path } = item;
    const existingTab = editors.findIndex((editor) => editor.label === name);
    console.log(path, name, type);

    // 탭이 6개 이상이거나 폴더인 경우
    if (editors.length >= 6) {
      return;
    }

    // 탭이 이미 열려있으면 해당 탭으로 이동
    if (existingTab !== -1) {
      setActiveTab(existingTab);
      return;
    }

    if (type === "file") {
      const newEditor = {
        label: name,
        content: (
          <Editor
            key={name}
            width="100%"
            height="75vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={fileTemp.content}
            // onChange={(value) => updateEditorContent(name, value)}
          />
        ),
      };
      setEditors((prevEditors) => [...prevEditors, newEditor]);
      setActiveTab(editors.length);
    }
  };

  // 드래그 리사이즈
  const startResizeTree = (event) => {
    setIsDragging(true);
    document.addEventListener("mousemove", resizeTree);
    document.addEventListener("mouseup", stopResize);
  };

  const resizeTree = (event) => {
    const newWidth = event.clientX;
    if (
      newWidth > minTreeWidth &&
      newWidth < window.innerWidth - minTreeWidth
    ) {
      setTreeWidth(newWidth);
    }
  };

  const startResizeResult = (event) => {
    setIsDragging(true);
    document.addEventListener("mousemove", resizeResult);
    document.addEventListener("mouseup", stopResize);
  };

  const resizeResult = (event) => {
    const newHeight = window.innerHeight - event.clientY;
    if (
      newHeight > minResultHeight &&
      newHeight < window.innerHeight - minResultHeight
    ) {
      setResultHeight(newHeight);
    }
  };

  const stopResize = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", resizeTree);
    document.removeEventListener("mousemove", resizeResult);
    document.removeEventListener("mouseup", stopResize);
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
    // const [activeTab, setActiveTab] = useState(0);

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

  // 파일 트리 조회
  // const fetchTreeData = () => {
  //     axios.get(`api/container/treeInfo/` + params.containerId , {
  //             headers: { Authorization: token },
  //         })
  //         .then(response => {
  //             const directoryStructure = response.data;
  //             setTreeData(directoryStructure);
  //         })
  //         .catch(error => {
  //             console.error("디렉토리 구조를 가져오는데 실패했습니다.", error);
  //         });
  // };

  // 새로고침 버튼 클릭 시 파일 트리 다시 조회
  const handleRefresh = () => {
    // fetchTreeData();
  };

  // 페이지 로딩 시 파일 트리 조회
  // useEffect(() => {
  //     fetchTreeData();
  // }, []);

  // 파일 생성

  // 파일 수정

  // 파일 삭제

  // 파일 조회
  const fetchFileData = (containerId, filePath) => {
    axios
      .get(
        `/api/container/fileContent?containerId={containerId}&filePath={filePath}`,
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        const fileContent = response.data;
        setFileData(fileContent);
      })
      .catch((error) => {
        console.error("파일 데이터를 가져오는데 실패했습니다.", error);
      });
  };

  // 파일 저장
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const fileSave = () => {
    alert(`저장되었습니다\n
        ${editorRef.current?.getValue()}`);
  };

  // 프로젝트 실행
  const fileRun = () => {};

  // 동시 편집
  useEffect(() => {
    // Yorkie 초기화
    initYorkie().then(({ doc }) => {
      setYorkieDoc(doc);
      // 문서 변경 감지
      doc.subscribe((event) => {
        if (event.type === "remote-change") {
          setEditorValue(doc.getRoot().content);
          const users = doc.getPresences();
          for (const { clientID, presence } of users) {
            setEditingUser(presence.name);
          }
        }
      });
      // 초기 문서 상태 적용
      if (doc.getRoot().content) {
        setEditorValue(doc.getRoot().content);
      }
    });
  }, []);

  // 에디터 내용 변경 시 Yorkie 문서 업데이트
  const handleEditorChange = (value) => {
    if (yorkieDoc) {
      yorkieDoc.update((root, presence) => {
        root.content = value;
      });
    }
  };

  // const updateEditorContent = (label, value) => {
  //     setEditors(prevEditors => prevEditors.map(editor => {
  //         if (editor.label === label) {
  //             return { ...editor, content: value };
  //         }
  //         return editor;
  //     }));
  // };

  return (
    <div className="edit-page">
      <div className="tree-container" style={{ width: treeWidth }}>
        <div className="tree-bar">
          프로젝트
          <IconButton sx={{ color: "white" }}>
            <CreateNewFolderIcon fontSize="medium" />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <NoteAddIcon fontSize="medium" />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <EditIcon fontSize="medium" />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <DeleteIcon fontSize="medium" />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <RefreshIcon fontSize="medium" />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <CreateNewFolderIcon fontSize="medium" />
          </IconButton>
          <IconButton sx={{ color: "#4ed9a5" }}>
            <SaveIcon fontSize="medium" />
          </IconButton>
          <IconButton sx={{ color: "#4ed9a5" }}>
            <PlayArrowIcon fontSize="medium" />
          </IconButton>
        </div>
        <div className="tree-main">
          <Tree data={treeTemp} />
        </div>
        <div className="resize-handle-vertical" onMouseDown={startResizeTree} />
      </div>

      <div className="editor-container">
        <div className="editor-bar" />
        {editors.length > 0 ? (
          <div className="tabs-container">
            <Tabs>
              {editors.map((editor, index) => (
                <Tab
                  key={index}
                  label={editor.label}
                  onClose={() => handleCloseTab(index)}
                >
                  {editor.content}
                </Tab>
              ))}
            </Tabs>
          </div>
        ) : (
          <div className="editor-placeholder">
            <div className="editor-image">
              <Editor
                value={editorValue}
                width="100%"
                height="75vh"
                theme="vs-dark"
                defaultLanguage="javascript"
                loading=""
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
              />
            </div>
          </div>
        )}
        <div
          className="resize-handle-horizontal"
          onMouseDown={startResizeResult}
          style={{ top: `calc(100% - ${resultHeight})` }}
        />
        <div className="result" style={{ height: resultHeight }}>
          결과창
        </div>
        <ChatBubble containerId={params.containerId} />
      </div>
    </div>
  );
}

export default ContainerEditPage;
