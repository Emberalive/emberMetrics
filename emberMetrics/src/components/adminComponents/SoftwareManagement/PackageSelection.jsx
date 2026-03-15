export default function PackageSelection({setChosenPackage, chosenPackage}) {
    return (
        <div className="package-selection">
            <label>Software to install:</label>
            <input type={'text'} placeholder={'\'btop\''} value={chosenPackage} onChange={(e) => setChosenPackage(e.target.value)}/>
        </div>
    )
}