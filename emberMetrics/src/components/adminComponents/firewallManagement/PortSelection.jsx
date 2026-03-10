export default function PortSelection({chosenPort, setChosenPort}) {
    return (
        <div className="package-selection">
            <label>Select a port</label>
            <input type={'number'} value={chosenPort} placeholder={'8080'}
                   onChange={(e) => setChosenPort(e.target.value)}></input>
        </div>
    )
}