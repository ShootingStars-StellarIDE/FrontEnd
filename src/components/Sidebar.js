import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Sidebar.css";


const Sidebar = ({ width = 280, children }) => {
    const [isOpen, setOpen] = useState(false);
    const [xPosition, setX] = useState(width);
    const side = useRef();

    // button 클릭 시 토글
    const toggleMenu = () => {
        if (xPosition > 0) {
            setX(0);
            setOpen(true);
        } else {
            setX(width);
            setOpen(false);
        }
    };

    // 사이드바 외부 클릭시 닫히는 함수
    const handleClose = async e => {
        let sideArea = side.current;
        let sideCildren = side.current.contains(e.target);
        if (isOpen && (!sideArea || !sideCildren)) {
            await setX(width);
            await setOpen(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', handleClose);
        return () => {
            window.removeEventListener('click', handleClose);
        };
    })


    return (
        <div className={styles.container}>
            <div ref={side} className={styles.sidebar} style={{ width: `${width}px`, height: '100%', transform: `translatex(${-xPosition}px)` }}>
                <button onClick={() => toggleMenu()}
                    className={styles.button} >
                    {isOpen ?
                        <span>X</span> : <span>O</span>
                    }
                </button>

                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};


export default Sidebar;