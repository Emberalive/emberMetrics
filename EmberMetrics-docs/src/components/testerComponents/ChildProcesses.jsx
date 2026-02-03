import TextArea from "../TextArea.jsx";

export default function ChildProcesses (props) {
    let childDataList;
    const children = props.metrics.childProcesses
    if (children) {

        childDataList = children.map(child => {
            return (
                    <div className={'child-processes__row'} key={child.pid} >
                        <p className={'child-processes__row-item'}>
                            {child.pid}
                        </p>
                        <p className={'child-processes__row-item'}>
                            {child.name}
                        </p>
                        <p className={'child-processes__row-item'}>
                            {child.cpu.toFixed(2)}
                        </p>
                        <p className={'child-processes__row-item'}>
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
        <section>
            <header className={'section-header'} >
                <h1>Child Processes</h1>
            </header>
            {props.activeView !== 'fullScreen' && <TextArea data={{
                text: [{
                    text: 'This displays the child processes, as default it changes every 1 minute, but eventually you will be able to change it to whatever interval you would like' +
                        '\n\nThe processes are arranged by cpu usage and only display the first 10, you will eventually be able to choose how many you want to display'
                }],
                code: []
            }}/>}
            <div className="child-processes__table">
                <div className={'child-processes__row child-processes__row-header'}>
                    <p className={'child-processes__header'}>
                        Pid
                    </p>
                    <p className={'child-processes__header '}>
                        Name
                    </p>
                    <p className={' child-processes__header'}>
                        CPU%
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
        </section>
    )
}
