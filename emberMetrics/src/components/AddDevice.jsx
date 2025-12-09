export default function AddDevice() {
    function submit (e) {
        e.preventDefault()

    }
    return (
        <form onSubmit={submit} className="device-management__form">
            <div className="device-management__form-container">
                <div className={"device-management__form-element"}>
                    <label>Device Name:</label>
                    <input type="text" placeholder={"Device Name"}></input>
                </div>
                <div className={"device-management__form-element"}>
                    <label>Device IP Address</label>
                    <input type="text" placeholder={"203.0.113.0"}></input>
                </div>
            </div>
        </form>
    )
}