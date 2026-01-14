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
