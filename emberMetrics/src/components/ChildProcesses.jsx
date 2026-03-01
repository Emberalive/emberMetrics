import React, {useEffect, useRef} from "react";

export default function ChildProcesses (props) {
    let childDataList;
    const children = props.metrics.childProcesses

    const [foundChild, setFoundChild] = React.useState(null);
    const [searchValue, setSearchValue] = React.useState("");

    //Refs are used, as inside an interval the value fo states and variables are caught and kept at the start of the interval
    //so I update the ref and use the ref inside the interval
    const intervalRef = React.useRef(null);
    const childrenRef = useRef(children);
    const foundChildRef = useRef(foundChild);

    useEffect(() => {
      foundChildRef.current = foundChild;
    }, [foundChild]);

    useEffect(() => {
        childrenRef.current = children;
    }, [children]);

    function searchChildProcesses() {
        if (searchValue) {
            const process = children.find(child => child.name === searchValue)
            if (process) {
                setFoundChild(process);
            } else {
                props.handleNotification('error', 'No child process found with name: ' + searchValue);
            }
        } else {
            props.handleNotification('error', 'Please enter a process name');
        }
    }

    function startInterval () {
        if (intervalRef.current) {
            resetInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            const current = childrenRef.current;
            const currentFound = foundChildRef.current;
            if (currentFound) {
                const updatedFoundChild = current.find(child => child.name === currentFound.name);
                if (updatedFoundChild) {
                    // needed to clone the data as the foundChild state gets the data from children, teh data may be different,
                    //but the object still has the same reference, as state re-render does a shallow comparison.
                    setFoundChild({...updatedFoundChild});
                }
            }
        }, 1000);
    }

    function resetInterval() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    if (children) {
        childDataList = children.map(child => {
            return (
                    <div className={'child-processes__row'} key={child.pid} title={child.name}>
                        <p className={'child-processes__row-item'}>
                            {child.pid}
                        </p>
                        <p className={'child-processes__row-item'} style={{fontWeight: 'bold', color: child.cpu >= 70.00 ? 'var(--danger)' : child.cpu > 40.00 ? 'orange' : ''}}>
                            {child.cpu.toFixed(2)}
                        </p>
                        <p className={'child-processes__row-item'}>
                            {child.name}
                        </p>
                        <p className={'child-processes__row-item'} style={{color: child.memory >= 70.00 ? 'var(--danger)' : child.memory > 40.00 ? 'orange' : ''}}>
                            {child.memory}
                        </p>
                        <p className={'child-processes__row-item'}>
                            {child.user}
                        </p>
                    </div>
            )
        })
    }
    return (
        <section className={'child-processes'}>
            <header className={'section-header'}>
                <h1>Child Processes</h1>
                    <div className={'child-processes__find-child'}>
                        <input type={'text'} placeholder={'Process Name'} value={searchValue} onChange={(e) => {
                            setSearchValue(e.target.value)
                        }}/>
                        <button className={'general-button'} onClick={() => {
                            searchChildProcesses();
                            resetInterval()
                            startInterval()
                            searchChildProcesses();
                        }}>Search</button>
                    </div>
            </header>
            { foundChild &&
                <div className={'child-processes__found-child-container'}>
                    <header className={'child-processes__found-child-header'}>
                        <h3>Result</h3>
                        <button className={'general-button danger-button'} onClick={() => {
                            setFoundChild(null)
                            resetInterval()
                            setSearchValue('')
                        }}>Stop</button>
                    </header>
                    <div className={'child-processes__row'} key={foundChild.pid} title={foundChild.name}>
                        <p className={'child-processes__row-item'}>
                            {foundChild.pid}
                        </p>
                        <p className={'child-processes__row-item'} style={{fontWeight: 'bold', color: foundChild.cpu >= 70.00 ? 'var(--danger)' : foundChild.cpu > 40.00 ? 'orange' : ''}}>
                            {foundChild.cpu.toFixed(2)}
                        </p>
                        <p className={'child-processes__row-item'}>
                            {foundChild.name}
                        </p>
                        <p className={'child-processes__row-item'} style={{color: foundChild.memory >= 70.00 ? 'var(--danger)' : foundChild.memory > 40.00 ? 'orange' : ''}}>
                            {foundChild.memory}
                        </p>
                        <p className={'child-processes__row-item'}>
                            {foundChild.user}
                        </p>
                    </div>
                </div>
            }
            <div  className={'child-processes__table__wrapper'}>
                <div className="child-processes__table">
                    <div className={'child-processes__row-header'}>
                        <p className={'child-processes__header'}>
                            Pid
                        </p>
                        <p className={'child-processes__header '}>
                            CPU%
                        </p>
                        <p className={' child-processes__header'}>
                            Name
                        </p>
                        <p className={'child-processes__header '}>
                            Mem%
                        </p>
                        <p className={'child-processes__header child-processes__header-end'}>
                            User
                        </p>
                    </div>
                    {childDataList}
                </div>
            </div>
        </section>
    )
}
