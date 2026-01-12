export default function ChildProcesses (props) {
    let childDataList;
    const children = props.metrics.childProcesses.slice(1, 11)
    if (children) {

        childDataList = children.map(child => {
            return (
                <li key={child.pid}>
                    <div className={'childData-item'} style={{display: "flex", justifyContent: "center", flexDirection: "column"}} >
                        <p style={{margin: 0}}>{child.pid} | {child.name} | {child.cpu.toFixed(2)} | {child.memory} |   {child.user}</p>
                    </div>
                </li>
            )
        })
    }
    return (
        <section>
            <h1 style={{margin:0}}>Child Processes</h1>
            <ul>
                <li>
                    <p>Pid  |  name  |   cpu  |   memory  |  user</p>
                </li>
                {childDataList}
            </ul>
        </section>
    )
}
