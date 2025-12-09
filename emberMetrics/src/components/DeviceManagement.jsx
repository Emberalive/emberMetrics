import AddDevice from "./AddDevice.jsx";

export default function DeviceManagement () {
    return (
        <>
            <div className="device-management__wrapper">
                <div className="device-management__container">
                    <header className="device-management__header">
                        <h1>Device Management</h1>
                    </header>
                    <AddDevice />
                </div>
            </div>

        </>
    )
}