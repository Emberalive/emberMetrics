import {useEffect, useState} from 'react'

export default function Profile (props) {
    const [isEditing, setEditing] = useState(false);
    const [editUser, setEditUser] = useState(props.user);

    useEffect(() => {
        setEditUser(props.user)
    }, [props.user]);

    let allowedDevicesList
    if (props.user.devices) {
        const allowedDevices = props.user.devices

        allowedDevicesList = allowedDevices.map(device => {
            return (
                <div className={'profile-item__container'} key={device.id}>
                    <label>{device.name}</label>
                    <p>{device.ip}</p>
                </div>
            )
        })
    }
    function resetEditUser () {
        setEditUser({
            username: props.user.username,
            email: props.user.email ? props.user.email : '',
            bio: props.user.bio ? props.user.bio : '',
            role: props.user.role,
            id: props.user.id,
            devices: props.user.devices,
        })
    }
    return (
        <div className="profile-container__wrapper">
            <section className={'profile'}>
                <div className="profile-container">
                    <header className="section-header">
                        <h1>Profile - {props.user.username}</h1>
                    </header>
                        {isEditing ?
                            <div className="profile-item__container">
                                <label>Name</label>
                                <input type={'text'} value={editUser.username} onChange={(e) => {
                                    setEditUser({ ...editUser, username: e.target.value })
                                }}/>
                            </div>
                            :
                            <div className="profile-item__container">
                                <h1>Name</h1>
                                <p className={'profile-item-container__text'}>{props.user.username}</p>
                            </div>
                        }
                        {isEditing ?
                            <div className="profile-item__container">
                                <label>Email</label>
                                <input type={'text'} value={editUser.email} onChange={(e) => {
                                    setEditUser({ ...editUser, email: e.target.value })
                                }}/>
                            </div>
                            :
                            <div className="profile-item__container">
                                <h1>Email</h1>
                                <p className={'profile-item-container__text'}>{props.user.email}</p>
                            </div>
                        }
                        {isEditing ?
                            <div className="profile-item__container">
                                <label>Bio</label>
                                <textarea className={'profile-item-container__bio__edit'} style={{borderBottom: '1px solid var(--secondary)'}} onChange={(e) => {
                                    setEditUser({ ...editUser, bio: e.target.value })
                                }}>{editUser.bio}</textarea>

                            </div>
                            :
                            <div className="profile-item__container">
                                <h1>Bio</h1>
                                <p className={'profile-item-container__bio'}>{props.user.bio}</p>
                            </div>
                        }
                    <div className="profile-button__container">
                        {isEditing ?
                            <>
                                <button className={'general-button danger-button'} onClick={() => {
                                    setEditing(prevState => !prevState);
                                    resetEditUser()
                                }}>cancel</button>

                                <button className={'general-button success-button'} onClick={async() => {
                                    const response = await props.patchUser(editUser)
                                    if (!response.success) {
                                        switch(response.status) {
                                            case 404:
                                                resetEditUser()
                                                props.handleNotification('error', 'Your user does not exist')
                                                break
                                            case 409:
                                                resetEditUser()
                                                props.handleNotification('error', 'username is already taken')
                                                break
                                            case 500:
                                                resetEditUser()
                                                props.handleNotification('error', 'Sorry there was a Server error')
                                                break
                                            default:
                                                resetEditUser()
                                                props.handleNotification('error', 'Something went wrong, sorry')
                                        }
                                    }
                                    setEditing(prevState => !prevState)
                                }}>Save</button>

                            </>
                            :
                            <>
                                <button type={'button'} className={'general-button success-button'} onClick={() => {
                                    setEditing(prevState => !prevState);
                                }}>Edit</button>
                            </>
                        }
                    </div>
                    <header className="section-header">
                        <h1>Allowed Devices</h1>
                    </header>
                        {allowedDevicesList &&
                            <div className="profile-devices__container">
                                    {allowedDevicesList}
                            </div>
                        }
                </div>
        </section>
    </div>
)
}
