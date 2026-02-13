export default function DeviceTypeSelection (props) {
    function onSubmit (e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const selectedType = formData.get('deviceType');
        props.setDeviceType(selectedType);
    }
    return (
        <div className={props.activeView === 'fullScreen' ? "display-none" : 'device-type-selection__wrapper'}>
            <section className="device-type-selection">
                <h1>Select the device type</h1>
                <div className={"description-container"}>
                    <p className={"description-container__title"}>
                        Host
                    </p>
                    <p className={"description-container__paragraph"}>
                        This is the device that will be hosting the website, this will automatically add localhost as a device to access
                        allowing you to see the devices resource usage by default.
                    </p>
                </div>
                <div className={"description-container"}>
                    <p className={"description-container__title"}>
                        Remote Access
                    </p>
                    <p className={"description-container__paragraph"}>
                        This is a device that will be used to allow access to simply watching resource usage of the devices on the website
                    </p>
                </div>
                <form onSubmit={onSubmit} className={"description-container__form"}>
                    <div className={"container__form__radio-container"}>
                        <input type="radio" name="deviceType" id="host" value="host" />
                        <label htmlFor="host">Host</label>
                    </div>

                    <div className={"container__form__radio-container"}>
                    <input type="radio" name="deviceType" id="remote-access" value="remote-access" /><label htmlFor="remote-access">Remote Access</label>
                    </div>
                    <button type="submit" className="general-button">Submit</button>
                </form>
            </section>
        </div>
    )
}