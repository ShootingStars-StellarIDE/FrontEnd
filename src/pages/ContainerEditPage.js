import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import yorkie from "yorkie-js-sdk";

import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ChatBubble from "../components/ContainerList/ChatBubble";

import "../styles/ContainerEditPage.css"

function ContainerEditPage() {
    const params = useParams();

    const [activeTab, setActiveTab] = useState(0);
    const tabName = useRef(null);
    
    const [treeWidth, setTreeWidth] = useState('20%'); 
    const [resultHeight, setResultHeight] = useState('30%');
    const [isDragging, setIsDragging] = useState(false);
    const minTreeWidth = 100;
    const minResultHeight = 100;

    const [selectedItemPath, setSelectedItemPath] = useState(null);

    const [treeData, setTreeData] = useState(null);
    const [fileType, setFileType] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [execResult, setExecResult] = useState('환영합니다');
    
    const [editors, setEditors] = useState([]);
    const editorRef = useRef(null);
    const editorValue = useRef(null);
    const yorkieDoc = useRef(null);
    const [updateTimeout, setUpdateTimeout] = useState(null);

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
        const res = await axios.get(`api/container/type/` + params.containerId , {
            headers: { Authorization: token },
        })
        if (res.status === 200) {
            setFileType(res.data);
        }      
    };

    // 파일 트리 조회
    const fetchTreeData = async () => {
        const res = await axios.get(`api/container/treeInfo/` + params.containerId , {
                headers: { Authorization: token },
        })
        if (res.status === 200) {
            setTreeData(res.data);
        } 
    };

    // 파일 트리에 path 속성 추가
    const addPathToTree = (node, parentPath = '') => {
        // 현재 노드의 경로를 계산
        const currentPath = parentPath === '' ? node.name : `${parentPath}/${node.name}`;
    
        // 현재 노드에 path 속성 추가
        node.path = currentPath;
    
        // 현재 노드가 디렉토리라면, 자식 노드들에 대해서도 재귀적으로 함수 호출
        if (node.type === 'directory' && node.children) {
            node.children.forEach(child => addPathToTree(child, currentPath));
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

        if (item.type === 'directory') {
            return (
                <div>
                    <div style={{
                        display: 'flex', 
                        alignItems: 'center',
                        backgroundColor: selectedItemPath === item.path ? '#04395E' : 'transparent',
                    }}
                    >
                        <IconButton
                            onClick={toggleCollapse} 
                            size='small'
                            sx={{
                            color: 'white',
                        }}     
                        >
                            {isCollapsed ?<ChevronRightIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                        <FolderIcon
                            fontSize='small'
                            sx={{
                                color: 'white',
                                marginRight: '8px',
                            }}
                        />
                        <span 
                            style={{ cursor: 'pointer' }} 
                            onClick={() => onNameClick(item)}
                        >
                            {item.name}
                        </span>
                    </div>
                    {!isCollapsed && (
                        <div 
                        style={{ 
                            paddingLeft: '30px', 
                            marginTop: '-8px'
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
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
                marginTop: '8px', 
                marginLeft: '10px',
                backgroundColor: selectedItemPath === item.path ? '#04395E' : 'transparent',
            }}
                onClick={() => onNameClick(item)}
            >
                <InsertDriveFileIcon
                    fontSize='small'
                    sx={{
                        color: 'white',
                        marginRight: '8px',
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
        const res = await axios.get(`/api/container/fileContent?containerId=` + params.containerId + `&filePath=` + filePath, {
            headers: { Authorization: token },
        })
        
        if (res.status === 200) {   
            return res.data;
        }
    };

    // 파일 저장
    const handleSaveFile = async () => {
        if (!selectedItemPath) {
            alert("파일을 선택해주세요.");
            return;
        }

        const containerId = params.containerId;
        const path = selectedItemPath.substring(selectedItemPath.indexOf('/'), selectedItemPath.lastIndexOf('/') + 1);
        const fileName = selectedItemPath.split('/').pop();
        const fileContent = editorRef.current?.getValue();

        const res = await axios.post(`/api/container/saveFile`, {containerId, path, fileName, fileContent}, {
            headers: { Authorization: token },
        })

        if (res.status === 200) {
            alert("파일이 저장되었습니다.");
        }
        else if (res.data.code === '1201') {
            alert("존재하지 않는 사용자입니다.");
        }
        else if (res.data.code === '2200') {
            alert("존재하지 않는 컨테이너입니다.");
        }
        else if (res.data.code === '2100') {
            alert("해당 컨테이너에 대한 권한이 없습니다.");
        }
        else if (res.data.code === '0004') {
            alert("명령어 실행에 실패하였습니다.");
        }
    };

    // 컨테이너 실행
    const handleRun = async () => {
        if (!selectedItemPath) {
            alert("파일을 선택해주세요.");
            return;
        }
        const containerId = params.containerId;
        let path = selectedItemPath.split('/').pop();

        if (fileType === 'JAVA') {
            // 배열
            let parts = selectedItemPath.split('/');
            // 마지막 부분에서 java 제거
            parts[parts.length - 1] = parts[parts.length - 1].replace('.java', '');
            // 그 전 디렉토리 + 파일이름
            path = parts.slice(2, parts.length).join('/');
        }

        const res = await axios.post(`/api/container/execution`, {containerId, path}, {
            headers: { Authorization: token },
        })

        if (res.status === 200) {
            alert("실행에 성공했습니다.");
            setExecResult(res.data);
            fetchTreeData();
        }
    };

    // 파일 생성 API
    const handleCreateFile = async () => {
        if (!selectedItemPath) {
            alert("파일이나 디렉토리를 선택해주세요.");
            return;
        }

        const containerId = params.containerId;
        const path = selectedItemPath.substring(selectedItemPath.indexOf('/'), selectedItemPath.lastIndexOf('/') + 1);
        const fileName = inputValue; 
        console.log(path, fileName);
        
        // fetchTreeData
    };


    // 파일 수정
    // /api/container/renameFile
    // POST
    // "containerId": 컨테이너 고유번호,
    // "currentPath" : 이동할 파일경로,
    // "movedPath": 이동될 경로,
    // "fileName" : 파일의 이름
    // 경로 예시
    // 생성될 파일의 절대경로가 /containerName/test.py 라면
    // -> path 의 값은 "/" fileName의 값은 "test.py" 로 보내주시면 됩니다.
    // 생성될 파일의 절대경로가 /containerName/src/project/test.java 라면
    // -> path 의 값은 "/src/project/" fileName의 값은 "test.java" 로 보내주시면 됩니다.


    // 파일 삭제
    // /api/container/deleteFile
    // DELETE
    // "containerId": 컨테이너 고유번호,
    // "path" : 파일경로,
    // "fileName" : 파일의 이름
    // }
    // 경로 예시
    // 생성될 파일의 절대경로가 /containerName/test.py 라면
    // -> path 의 값은 "/" fileName의 값은 "test.py" 로 보내주시면 됩니다.
    // 생성될 파일의 절대경로가 /containerName/src/project/test.java 라면
    // -> path 의 값은 "/src/project/" fileName의 값은 "test.java" 로 보내주시면 됩니다.


    // 디렉토리 생성
    // `/api/container/createDirectory`
    // POST
    // "containerId": 컨테이너 고유번호,
    // "path" : 파일경로,
    // "directoryName" : 디렉토리 이름
    // 경로 예시
    // 생성될 디렉토리의 절대경로가 /containerName/test 라면
    // -> path 의 값은 "/" directoryName의 값은 "test" 로 보내주시면 됩니다.
    // 생성될 파일의 절대경로가 /containerName/src/project/test 라면
    // -> path 의 값은 "/src/project/" directoryName의 값은 "test" 로 보내주시면 됩니다.


    // 디렉토리 수정
    // /api/container/renameDirectory
    // POST
    // "containerId": 컨테이너 고유번호,
    // "currentPath" : 이동할 파일경로,
    // "movedPath": 이동될 경로,
    // "directoryName" : 디렉토리 이름
    // 경로 예시
    // 생성될 디렉토리의 절대경로가 /containerName/test 라면
    // -> path 의 값은 "/" directoryName의 값은 "test" 로 보내주시면 됩니다.
    // 생성될 파일의 절대경로가 /containerName/src/project/test 라면
    // -> path 의 값은 "/src/project/" directoryName의 값은 "test" 로 보내주시면 됩니다.


    // 디렉토리 삭제
    // /api/container/deleteDirectory
    // DELETE
    // "containerId": 컨테이너 고유번호,
    // "path" : 파일경로,
    // "directoryName" : 디렉토리 이름
    // 경로 예시
    // 생성될 디렉토리의 절대경로가 /containerName/test 라면
    // -> path 의 값은 "/" directoryName의 값은 "test" 로 보내주시면 됩니다
    // 생성될 파일의 절대경로가 /containerName/src/project/test 라면
    // -> path 의 값은 "/src/project/" directoryName의 값은 "test" 로 보내주시면 됩니다.


    // 파일, 디렉토리 클릭
    const onNameClick = async (item) => {
        const { name, type, path } = item;

        if (selectedItemPath === path) {
            setSelectedItemPath(null); // 이미 선택된 경우 선택 해제
        } else {
            setSelectedItemPath(path); // 선택되지 않은 경우 선택
        }
      
        // 탭이 6개 이상
        if (editors.length >= 6) {
            return;
        }

        if (type === "file") {
            const newPath = path.replace(/\//g, '-');
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
                        height="75vh"
                        theme="vs-dark"
                        defaultLanguage={fileType === 'JAVA' ? "java" : "python"}
                        onMount={handleEditorDidMount}
                        onChange={handleEditorChange}
                    />
                )
            };
            // 탭이 이미 열려있으면 해당 탭으로 이동
            const existingTab = editors.findIndex(editor => editor.label === name);
            if (existingTab !== -1) {
                
                setEditors(prevEditors => {
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
            setEditors(prevEditors => [...prevEditors, newEditor]);
            setActiveTab(editors.length);
        }
        
    };

    // Yorkie 생성
    const initYorkie = async (docName) => {
        const client = new yorkie.Client('https://api.yorkie.dev', {
            apiKey: 'cn7m65tafcg8gj9icml0',
        });
        await client.activate();
        const doc = new yorkie.Document(docName);
        
        await client.attach(doc, {
            initialPresence: {
                name: "사용자",
            }
        });
        
        return { client, doc };
    };

    // 드래그 리사이즈
    const startResizeTree = (event) => {
        setIsDragging(true);
        document.addEventListener('mousemove', resizeTree);
        document.addEventListener('mouseup', stopResize);
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
        document.removeEventListener('mousemove', resizeTree);
        document.removeEventListener('mousemove', resizeResult);
        document.removeEventListener('mouseup', stopResize);
    };
   
    // 탭
    function Tab({ label, path, isActive, onClick, onClose }) {
        return (
            <div className={`tab ${isActive ? 'active' : ''}`} onClick={onClick}>
                {label}
                <button className="close-tab" onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}>x</button>
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
                        height="75vh"
                        theme="vs-dark"
                        defaultLanguage={fileType === 'JAVA' ? "java" : "python"}
                        onMount={handleEditorDidMount}
                        onChange={handleEditorChange}
                    />
                )
            };
            setEditors(prevEditors => {
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
                onClick: () => handleTabClick(index, child.props.label, child.props.path),
            });
        });

        return (
        <div className="tabs">
            <div className="tab-list">
                <div style={{display: 'flex'}}>
                {tabs}
                </div>
                <div className="tab-button">
                <IconButton onClick={handleSaveFile} sx={{ color: 'white' }}>
                    <SaveIcon
                        fontSize="medium"
                    />
                </IconButton>
                    <IconButton onClick={handleRun} sx={{ color: 'white' }}>
                    <PlayArrowIcon
                        fontSize="medium"
                    />
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
        }
        else setActiveTab(index - 1);
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

    const createYorkieDoc = async (docName) => {

        await initYorkie(docName).then(async ({ doc }) => {
            yorkieDoc.current = doc;

            // 문서 변경 감지
            doc.subscribe((event) => {
              if (event.type === 'remote-change') {
                  editorValue.current = doc.getRoot().content;
                  setEditors(prevEditors => {
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
            }
            else {
                const newPath = docName.replace(/\-/g, '/');
                const result = newPath.match(/src\/.*/)[0];
                const response = await fetchFileData(result);
                editorValue.current = response;
            }
          });
    }

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

    return (
        <div className="edit-page">
            <div className="tree-container" style={{width: treeWidth}}>
                <div className="tree-bar">
                    <IconButton sx={{ color: 'white' }}>
                        <CreateNewFolderIcon
                            fontSize="medium"
                        />
                    </IconButton>
                    <IconButton onClick={handleCreateFile} sx={{ color: 'white' }}>
                        <NoteAddIcon
                            fontSize="medium"
                        />
                    </IconButton>
                    <IconButton sx={{ color: 'white' }}>
                        <EditIcon
                            fontSize="medium"
                        />
                    </IconButton>
                    <IconButton sx={{ color: 'white' }}>
                        <DeleteIcon
                            fontSize="medium"
                        />
                    </IconButton>
                    <IconButton onClick={handleRefresh} sx={{ color: 'white' }}>
                        <RefreshIcon
                            fontSize="medium"
                        />
                    </IconButton>
                    
                </div>
                <div className="tree-main">
                    <Tree data={treeData}/>
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
                            >
                            </Tab>
                        ))}
                    </Tabs>
                        <div>
                            {editors[activeTab].content}
                        </div>   
                    </div>
                    ) : (
                    <div className="editor-placeholder">
                        <div className="editor-image">
                            나눔고딕
                        </div>
                    </div>
                )}
                <div className="resize-handle-horizontal" onMouseDown={startResizeResult} style={{top: `calc(100% - ${resultHeight})`}}/>
                <div className="result" style={{height: resultHeight}}>
                    <pre>{execResult}</pre>
                </div>
                <ChatBubble containerId={params.containerId} />
            </div>
        </div>
    );
}

export default ContainerEditPage;