import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import yorkie from "yorkie-js-sdk";

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
import logo from "../assets/logo_stellar.png";

function ContainerEditPage() {
  const params = useParams();

  const [activeTab, setActiveTab] = useState(0);
  const tabName = useRef(null);

  const [treeWidth, setTreeWidth] = useState("20%");
  const [isDragging, setIsDragging] = useState(false);
  const minTreeWidth = 100;

  const [treeData, setTreeData] = useState(null);
  const [fileType, setFileType] = useState("");
  const [selectedItemPath, setSelectedItemPath] = useState([]);
  const [execResult, setExecResult] = useState("환영합니다");

  const [editors, setEditors] = useState([]);
  const editorRef = useRef(null);
  const editorValue = useRef(null);
  const yorkieDoc = useRef(null);
  const yorkieClient = useRef(null);
  const yorkieKey = process.env.REACT_APP_YORKIE_API_KEY;
  const [updateTimeout, setUpdateTimeout] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const token = localStorage.getItem("Authorization");

  // 페이지 로딩 시 파일 트리 조회
  useEffect(() => {
    fetchTreeData();
    getFileType();
  }, []);

  useEffect(() => {
    if (treeData) {
      addPathToTree(treeData);
    }
  }, [treeData]);

  const getFileType = async () => {
    try {
      const res = await axios.get(`api/container/type/` + params.containerId, {
        headers: { Authorization: token },
      });
      if (res.status === 200) {
        setFileType(res.data);
      }
    } catch (error) {
      const errorInfo = error.response.data;
      alert(errorInfo.description);
    }
  };

  // 파일 트리 조회
  const fetchTreeData = async () => {
    setIsLoading(true);

    try {
      const res = await axios.get(
        `api/container/treeInfo/` + params.containerId,
        {
          headers: { Authorization: token },
        }
      );
      if (res.status === 200) {
        setTreeData(res.data);
      }
    } catch (error) {
      const errorInfo = error.response.data;
      alert(errorInfo.description);
    } finally {
      setIsLoading(false);
    }
  };

  // 파일 트리에 path 속성 추가
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

  // 파일 트리
  const Tree = ({ data }) => {
    if (data) {
      return <TreeItem item={data} />;
    }
    return;
  };

  const TreeItem = ({ item }) => {
    // 디렉토리인 경우, 재귀적으로 TreeItem 컴포넌트를 호출
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    if (item.type === "directory") {
      return (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor:
                selectedItemPath.length === 0
                  ? "transparent"
                  : selectedItemPath.path === item.path
                  ? "#04395E"
                  : "transparent",
            }}
          >
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
            <div
              style={{
                paddingLeft: "30px",
                marginTop: "-8px",
              }}
            >
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
          marginTop: "8px",
          marginLeft: "10px",
          backgroundColor:
            selectedItemPath.length === 0
              ? "transparent"
              : selectedItemPath.path === item.path
              ? "#04395E"
              : "transparent",
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

  // 새로고침 버튼 클릭 시 파일 트리 다시 조회
  const handleRefresh = () => {
    fetchTreeData();
  };

  // 파일 내용 조회
  const fetchFileData = async (filePath) => {
    setIsLoading(true);

    try {
      const res = await axios.get(
        `/api/container/fileContent?containerId=` +
          params.containerId +
          `&filePath=` +
          filePath,
        {
          headers: { Authorization: token },
        }
      );
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      const errorInfo = error.response.data;
      alert(errorInfo.description);
    } finally {
      setIsLoading(false);
    }
  };

  // 파일 저장
  const handleSaveFile = async () => {
    if (editors.length === 0 || activeTab < 0 || activeTab >= editors.length) {
      alert("탭을 열어주세요");
      return;
    }

    setIsLoading(true);

    const containerId = params.containerId;
    const activeEditor = editors[activeTab];
    const realPath = activeEditor.path.replace(/\-/g, "/");
    const path = realPath.substring(
      realPath.indexOf("/"),
      realPath.lastIndexOf("/") + 1
    );
    const fileName = realPath.split("/").pop();
    const fileContent = editorRef.current?.getValue();
    try {
      const res = await axios.post(
        `/api/container/saveFile`,
        { containerId, path, fileName, fileContent },
        {
          headers: { Authorization: token },
        }
      );
      if (res.status === 200) {
        alert("파일이 저장되었습니다.");
      }
    } catch (error) {
      const errorInfo = error.response.data;
      alert(errorInfo.description);
    } finally {
      setIsLoading(false);
    }
  };

  // 컨테이너 실행
  const handleRun = async () => {
    if (editors.length === 0 || activeTab < 0 || activeTab >= editors.length) {
      alert("탭을 열어주세요");
      return;
    }

    setIsLoading(true);

    const containerId = params.containerId;
    const activeEditor = editors[activeTab];
    const realPath = activeEditor.path.replace(/\-/g, "/");
    let path;
    let parts = realPath.split("/");

    if (fileType === "JAVA") {
      // 마지막 부분에서 java 제거
      parts[parts.length - 1] = parts[parts.length - 1].replace(".java", "");
      // 그 전 디렉토리 + 파일이름
      path = parts.slice(2, parts.length).join("/");
    } else {
      path = parts.slice(1, parts.length).join("/");
    }
    try {
      const res = await axios.post(
        `/api/container/execution`,
        { containerId, path },
        {
          headers: { Authorization: token },
        }
      );

      if (res.status === 200) {
        setExecResult(res.data);
        fetchTreeData();
      }
    } catch (error) {
      const errorInfo = error.response.data;
      alert(errorInfo.description);
      // setExecResult("실행에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 파일, 디렉토리 삭제
  const handleDelete = async () => {
    if (selectedItemPath.length === 0) {
      alert("파일이나 디렉토리를 선택해주세요.");
      return;
    }

    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (!isConfirmed) {
      return;
    }

    setIsLoading(true);

    const containerId = params.containerId;
    const fileName = selectedItemPath.path.split("/").pop();
    const directoryName = selectedItemPath.path.split("/").pop();
    const path = selectedItemPath.path.substring(
      selectedItemPath.path.indexOf("/"),
      selectedItemPath.path.lastIndexOf("/") + 1
    );

    if (selectedItemPath.type === "file") {
      try {
        const res = await axios.delete(
          `/api/container/deleteFile?containerId=` +
            containerId +
            `&path=` +
            path +
            `&fileName=` +
            fileName,
          {
            headers: { Authorization: token },
          }
        );

        if (res.status === 200) {
          yorkieDoc.current.update((root) => {
            root.content = "";
          });
          await yorkieClient.current.detach(yorkieDoc.current);

          const deletedPath = selectedItemPath.path.replace(/\//g, "-");
          const tabIndex = editors.findIndex(
            (editor) => editor.path === deletedPath
          );
          if (tabIndex !== -1) {
            handleCloseTab(tabIndex);
          }
          fetchTreeData();
          alert("삭제되었습니다.");
        }
      } catch (error) {
        const errorInfo = error.response.data;
        alert(errorInfo.description);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const res = await axios.delete(
          `/api/container/deleteDirectory?containerId=` +
            containerId +
            `&path=` +
            path +
            `&directoryName=` +
            directoryName,
          {
            headers: { Authorization: token },
          }
        );

        if (res.status === 200) {
          fetchTreeData();
          alert("삭제에 성공했습니다.");
        }
      } catch (error) {
        const errorInfo = error.response.data;
        alert(errorInfo.description);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const InputModal = ({ isOpen, onClose, onSubmit, title }) => {
    const [input, setInput] = useState("");

    const handleSubmit = () => {
      onSubmit(input);
      onClose();
    };

    if (!isOpen) return null;

    return (
      <>
        {/* 오버레이 */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", // 반투명 배경
            zIndex: 999,
          }}
          onClick={onClose}
        ></div>

        {/* 모달 창 */}
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            width: "20%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#363636",
            padding: "16px",
            zIndex: 1000,
            borderRadius: "8px",
          }}
        >
          <h5>{title}</h5>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "16px",
            }}
          />
          <div style={{ textAlign: "right" }}>
            <button
              className="input-modal-button"
              style={{
                backgroundColor: "#4ed9a5",
                color: "white",
                border: "none",
                padding: "6px 10px",
                marginRight: "10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handleSubmit}
            >
              제출
            </button>
            <button
              className="input-modal-button"
              style={{
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                padding: "6px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={onClose}
            >
              취소
            </button>
          </div>
        </div>
      </>
    );
  };

  const handleCreateFileClick = () => {
    if (selectedItemPath.length === 0) {
      alert("파일이나 디렉토리를 선택해주세요.");
      return;
    }

    setModalAction("createFile");
    setIsModalOpen(true);
  };

  const handleCreateDirClick = () => {
    if (selectedItemPath.length === 0) {
      alert("파일이나 디렉토리를 선택해주세요");
      return;
    }

    setModalAction("createDir");
    setIsModalOpen(true);
  };

  // 파일 생성
  const handleCreateFile = async (value) => {
    const containerId = params.containerId;
    const fileName = value;
    let path;

    setIsLoading(true);

    if (selectedItemPath.type === "directory") {
      path =
        "/" +
        selectedItemPath.path.substring(
          selectedItemPath.path.indexOf("/") + 1
        ) +
        "/";
    } else {
      path = selectedItemPath.path.substring(
        selectedItemPath.path.indexOf("/"),
        selectedItemPath.path.lastIndexOf("/") + 1
      );
    }
    try {
      const res = await axios.post(
        `/api/container/createFile`,
        { containerId, path, fileName },
        {
          headers: { Authorization: token },
        }
      );

      if (res.status === 200) {
        fetchTreeData();
        alert("파일이 생성되었습니다.");
      }
    } catch (error) {
      const errorInfo = error.response.data;
      alert(errorInfo.description);
    } finally {
      setIsLoading(false);
    }
  };

  // 디렉토리 생성
  const handleCreateDir = async (value) => {
    const containerId = params.containerId;
    const directoryName = value;
    let path;

    setIsLoading(true);

    if (selectedItemPath.type === "directory") {
      path =
        "/" +
        selectedItemPath.path.substring(
          selectedItemPath.path.indexOf("/") + 1
        ) +
        "/";
    } else {
      path = selectedItemPath.path.substring(
        selectedItemPath.path.indexOf("/"),
        selectedItemPath.path.lastIndexOf("/") + 1
      );
    }
    try {
      const res = await axios.post(
        `/api/container/createDirectory`,
        { containerId, path, directoryName },
        {
          headers: { Authorization: token },
        }
      );

      if (res.status === 200) {
        fetchTreeData();
        alert("디렉토리가 생성되었습니다.");
      }
    } catch (error) {
      const errorInfo = error.response.data;
      alert(errorInfo.description);
    } finally {
      setIsLoading(false);
    }
  };

  // 트리 아이템 클릭
  const onNameClick = async (item) => {
    const { name, type, path } = item;

    if (selectedItemPath && selectedItemPath.path === path) {
      setSelectedItemPath([]); // 이미 선택된 경우 선택 해제
    } else {
      setSelectedItemPath(item); // 선택되지 않은 경우 선택
    }

    // 탭이 6개 이상
    if (editors.length >= 6) {
      return;
    }

    if (type === "file") {
      const newPath = path.replace(/\//g, "-");
      tabName.current = newPath;
      await createYorkieDoc(newPath); // doc 생성
      const newEditor = {
        label: name,
        path: newPath,
        content: (
          <Editor
            key={name}
            value={editorValue.current}
            width="100%"
            height="60vh"
            theme="vs-dark"
            defaultLanguage={fileType === "JAVA" ? "java" : "python"}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
          />
        ),
      };
      // 탭이 이미 열려있으면 해당 탭으로 이동
      const existingTab = editors.findIndex((editor) => editor.label === name);
      if (existingTab !== -1) {
        setEditors((prevEditors) => {
          // 새 배열을 만들고 이전 상태를 복사합니다.
          const updatedEditors = [...prevEditors];
          // 지정된 인덱스에 newEditor를 설정합니다.
          updatedEditors[existingTab] = newEditor;
          // 수정된 배열을 반환합니다.
          return updatedEditors;
        });

        setActiveTab(existingTab);
        return;
      }
      setEditors((prevEditors) => [...prevEditors, newEditor]);
      setActiveTab(editors.length);
    }
  };

  // Yorkie 생성
  const initYorkie = async (docName) => {
    const client = new yorkie.Client("https://api.yorkie.dev", {
      apiKey: yorkieKey,
    });
    await client.activate();
    const doc = new yorkie.Document(docName);

    await client.attach(doc, {
      initialPresence: {
        name: "사용자",
      },
    });

    return { client, doc };
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

  const stopResize = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", resizeTree);
    document.removeEventListener("mouseup", stopResize);
  };

  // 탭
  function Tab({ label, path, isActive, onClick, onClose }) {
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
    const handleTabClick = async (index, name, path) => {
      await createYorkieDoc(path);
      const newEditor = {
        label: name,
        path: path,
        content: (
          <Editor
            key={name}
            value={editorValue.current}
            width="100%"
            height="60vh"
            theme="vs-dark"
            defaultLanguage={fileType === "JAVA" ? "java" : "python"}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
          />
        ),
      };
      setEditors((prevEditors) => {
        // 새 배열을 만들고 이전 상태를 복사합니다.
        const updatedEditors = [...prevEditors];
        // 지정된 인덱스에 newEditor를 설정합니다.
        updatedEditors[index] = newEditor;
        // 수정된 배열을 반환합니다.
        return updatedEditors;
      });
      setActiveTab(index);
    };

    const tabs = React.Children.toArray(children).map((child, index) => {
      return React.cloneElement(child, {
        isActive: index === activeTab,
        onClick: () =>
          handleTabClick(index, child.props.label, child.props.path),
      });
    });

    return (
      <div className="tabs">
        <div className="tab-list">
          <div style={{ display: "flex" }}>{tabs}</div>
          <div className="tab-button">
            <IconButton onClick={handleSaveFile} sx={{ color: "white" }}>
              <SaveIcon fontSize="medium" />
            </IconButton>
            <IconButton onClick={handleRun} sx={{ color: "white" }}>
              <PlayArrowIcon fontSize="medium" />
            </IconButton>
          </div>
        </div>

        {tabs.length > 0 && (
          <div className="tab-panel">{tabs[activeTab].props.children}</div>
        )}
      </div>
    );
  }

  const handleCloseTab = (index) => {
    setEditors((prevEditors) => prevEditors.filter((_, i) => i !== index));
    if (index === 0) {
      setActiveTab(0);
    } else setActiveTab(index - 1);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // containerName-filePath로 doc를 생성
  useEffect(() => {
    if (tabName.current !== null) {
      createYorkieDoc(tabName.current);
    }
  }, []);
  // containerName-filePath로 doc를 생성
  useEffect(() => {
    if (tabName.current !== null) {
      createYorkieDoc(tabName.current);
    }
  }, []);

  const createYorkieDoc = async (docName) => {
    setIsLoading(true);
    await initYorkie(docName).then(async ({ doc, client }) => {
      yorkieDoc.current = doc;
      yorkieClient.current = client;

      // 문서 변경 감지
      doc.subscribe((event) => {
        if (event.type === "remote-change") {
          editorValue.current = doc.getRoot().content;
          setEditors((prevEditors) => {
            // 배열의 복사본을 만듭니다.
            const updatedEditors = [...prevEditors];
            // existingTab 인덱스에 있는 Editor를 가져옵니다.
            const currentEditor = updatedEditors[activeTab];

            // currentEditor가 존재하는 경우에만 업데이트를 진행합니다.
            if (currentEditor) {
              // Editor의 value만 업데이트합니다.
              const updatedEditor = {
                ...currentEditor, // 현재 Editor의 모든 속성을 복사합니다.
                content: React.cloneElement(currentEditor.content, {
                  value: editorValue.current, // value 속성만 새 값으로 업데이트합니다.
                }),
              };
              // 업데이트된 Editor로 교체합니다.
              updatedEditors[activeTab] = updatedEditor;
            }
            // 수정된 배열을 반환합니다.
            return updatedEditors;
          });
        }
      });

      // 초기 문서 상태 적용
      if (doc.getRoot().content) {
        editorValue.current = doc.getRoot().content;
      } else {
        const newPath = docName.replace(/\-/g, "/");
        const result = newPath.match(/src\/.*/)[0];
        const response = await fetchFileData(result);
        editorValue.current = response;
      }
      setIsLoading(false);
    });
  };

  // 에디터 내용 변경 시 Yorkie 문서 업데이트
  const handleEditorChange = (value) => {
    if (!yorkieDoc.current) return;

    // 이미 예약된 업데이트가 있다면 취소
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    // 새로운 업데이트를 1초 후에 실행하도록 예약
    const timeoutId = setTimeout(() => {
      yorkieDoc.current.update((root) => {
        root.content = value;
      });
    }, 500); // 일정 시간 후 업데이트

    // setTimeout으로 생성된 ID를 저장하여 필요 시 clearTimeout으로 취소
    setUpdateTimeout(timeoutId);
  };

  //   const handleRenameClick = () => {
  //     if (selectedItemPath.length === 0) {
  //       alert("파일이나 디렉토리를 선택해주세요");
  //       return;
  //     }

  //     setModalAction("edit");
  //     setIsModalOpen(true);
  //   };

  // 파일 수정
  //   const handleRename = async (value) => {
  //     const containerId = params.containerId;
  //     const path = selectedItemPath.path.substring(
  //       selectedItemPath.path.indexOf("/"),
  //       selectedItemPath.path.lastIndexOf("/") + 1
  //     );
  //     const fileName = selectedItemPath.name;
  //     const directoryName = selectedItemPath.name;
  //     const changeName = value;

  //     if (selectedItemPath.type === "file") {
  //       const res = await axios.post(
  //         `/api/container/renameFile`,
  //         { containerId, path, fileName, changeName },
  //         {
  //           headers: { Authorization: token },
  //         }
  //       );

  //       if (res.status === 200) {
  //         alert("파일 수정에 성공했습니다.");
  //         fetchTreeData();
  //       }
  //     } else {
  //       const res = await axios.post(
  //         `/api/container/renameDirectory`,
  //         { containerId, path, directoryName, changeName },
  //         {
  //           headers: { Authorization: token },
  //         }
  //       );

  //       if (res.status === 200) {
  //         alert("디렉토리 수정에 성공했습니다.");
  //         fetchTreeData();
  //       }
  //     }
  //   };

  // 로딩 모달
  const LoadingModal = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
      <div className="loading-modal">
        <div className="loading-spinner"></div>
        <p className={"loading-p"}>데이터를 불러오는 중입니다...</p>
      </div>
    );
  };

  return (
    <div className="edit-page">
      <div className="tree-container" style={{ width: treeWidth }}>
        <div className="tree-bar">
          <div>
            <IconButton onClick={handleCreateDirClick} sx={{ color: "white" }}>
              <CreateNewFolderIcon fontSize="medium" />
            </IconButton>
            <IconButton onClick={handleCreateFileClick} sx={{ color: "white" }}>
              <NoteAddIcon fontSize="medium" />
            </IconButton>
            {/* <IconButton onClick={handleRenameClick} sx={{ color: "white" }}>
            <EditIcon fontSize="medium" />
          </IconButton> */}
            <IconButton onClick={handleDelete} sx={{ color: "white" }}>
              <DeleteIcon fontSize="medium" />
            </IconButton>
          </div>
          <div>
            <IconButton onClick={handleRefresh} sx={{ color: "white" }}>
              <RefreshIcon fontSize="medium" />
            </IconButton>
          </div>
        </div>
        <div className="tree-main">
          <Tree data={treeData} />
        </div>
        <div className="resize-handle-vertical" onMouseDown={startResizeTree} />
      </div>

      <div className="editor-container">
        {editors.length > 0 ? (
          <div className="tabs-container">
            <Tabs>
              {editors.map((editor, index) => (
                <Tab
                  key={index}
                  label={editor.label}
                  path={editor.path}
                  onClose={() => handleCloseTab(index)}
                ></Tab>
              ))}
            </Tabs>
            <div>{editors[activeTab].content}</div>
          </div>
        ) : (
          <div className="editor-placeholder">
            <div className="editor-image">
              <img className="logo" src={logo} alt="logo"></img>
              <p>Stellar-IDE ver.1</p>
              <p>주의사항</p>
              <p>- 실행하기 전에 꼭 저장해주세요.</p>
              <p>- 파일이나 디렉토리 이름은 중복이 불가능합니다.</p>
              <p>- 새로고침 버튼을 누르면 파일을 다시 조회합니다.</p>
              <p>
                - 컨테이너명, src, project 디렉토리를 삭제할 시 문제가 발생할 수
                있습니다.
              </p>
            </div>
          </div>
        )}
        <div className="result">
          <pre>{execResult}</pre>
        </div>
        <ChatBubble containerId={params.containerId} />
        <LoadingModal isLoading={isLoading} />
        <InputModal
          title={
            modalAction === "createFile"
              ? "새파일 생성하기"
              : modalAction === "createDir"
              ? "새디렉토리 생성하기"
              : ""
          }
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(value) => {
            setIsModalOpen(false);
            if (modalAction === "createFile") {
              handleCreateFile(value);
            } else if (modalAction === "createDir") {
              handleCreateDir(value);
            }
            // else if (modalAction === "edit") {
            //   handleRename(value);
            // }
          }}
        />
      </div>
    </div>
  );
}

export default ContainerEditPage;
