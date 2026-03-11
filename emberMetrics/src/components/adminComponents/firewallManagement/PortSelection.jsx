export default function PortSelection({chosenPort, setChosenPort, chosenRule}) {
    function checkChosenRule() {
        if (chosenRule === "allow" || chosenRule === "deny") {
            return true;
        }
        setChosenPort(0);
        return false;
    }

    return (
        <div className={checkChosenRule()? "package-selection" : "package-selection package-selection__disabled"}>
            <label>Select a port</label>
            <input type={'number'} value={checkChosenRule() ? chosenPort: 0} placeholder={'8080'}
                   onChange={(e) => setChosenPort(e.target.value)}></input>
        </div>
    )
}