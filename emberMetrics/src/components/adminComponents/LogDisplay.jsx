import {useEffect, useState} from "react";

export default function LogDisplay({logs, setDisplayLogs, setLogs, logDisplayRef}) {
    let log
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        log = logs.join('\n');
    }, [logs]);

    const onMouseUp=() => {
        setIsDragging(false)
        logDisplayRef.current.removeEventListener("mousemove", onMouseMove)
        logDisplayRef.current.removeEventListener("mouseup", onMouseUp)
    }
    const onMouseMove=(e) => {
        if (!isDragging) return;
        logDisplayRef.current.style.left = `${e.clientX - offset.x}px`;
        logDisplayRef.current.style.top = `${e.clientY - offset.y}px`;
    }
    const onMouseDown=(e) => {
        setIsDragging(true);
        const rect = logDisplayRef.current.getBoundingClientRect();
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });

        logDisplayRef.current.addEventListener("mousemove", onMouseMove)
        logDisplayRef.current.addEventListener("mouseup", onMouseUp)
    }


    return (
        <div style={{height: '100%', width: '100%', zIndex: '100', position: 'absolute', left: 'var(--element-padding)', top: 'var(--element-padding)'}}  onMouseUp={() => onMouseUp()} onMouseMove={(e) => onMouseMove(e)} >
            <section id="log-container" ref={logDisplayRef} >
                <header id={'log-mover'} onMouseDown={(e) => onMouseDown(e) }>
                    <p className={'log-title'}>Logs</p>
                    <p className={'log-close'} onClick={() => {
                        setDisplayLogs(prevState => !prevState)
                        setLogs([])
                    }}>X</p>
                </header>
                <div className="log-container-item__wrapper">
                    <p className={'log-container-item'}>{logs.join('\n')}</p>
                </div>
            </section>
        </div>
    )
}