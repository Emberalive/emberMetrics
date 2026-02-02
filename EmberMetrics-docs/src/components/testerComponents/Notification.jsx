export default function Notification (props) {
    const notification = props.notification
    return (
        <div className={notification === "" ? "notification" : "notification notification__active"} style={notification.type === "error" ? {backgroundColor: "palevioletred", borderRight: "3px solid red"} : {}}>
            <p className={"title"}>{notification.type === "error" ? "Error" : "Notification"}</p>
            <p>{notification.message}</p>
        </div>
    )
}