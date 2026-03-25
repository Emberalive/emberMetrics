import {useEffect, useState} from 'react'
import UserManagement from "../admin/UserManagement.jsx";
import SubNav from "../shared/SubNav.jsx";

export default function Profile (props) {
    // Only used for admins
    const [isEditing, setEditing] = useState(false);
    const [editUser, setEditUser] = useState(props.user);

    useEffect(() => {
        setEditUser(props.user)
    }, [props.user]);

    let allowedDevicesList
    if (props.user.devices) {
        const allowedDevices = props.devices

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
            details: props.user.details,
            role: props.user.role,
            id: props.user.id,
            devices: props.user.devices,
        })
    }

    async function patchUser (updatedUser) {
        try {
            const sessionId = localStorage.getItem('sessionId');
            if (!sessionId) {
                props.handleNotification('notice', 'Your session has ran out, please refresh the page');
            }
            console.info('[ App.jsx - patchUser ] starting function')
            const response = await fetch(`http://${props.deviceType === "remote-access" ? props.hostIp : "127.0.0.1"}:3000/users`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId,
                },
                body: JSON.stringify({
                    username: props.user.username,
                    newUser: updatedUser,
                })
            })
            if (response.ok) {
                const resData = await response.json()
                if (resData.success) {
                    props.setUser(resData.updatedUser)
                    props.handleNotification('notice', 'User info successfully updated')
                    setEditing(false);
                    return {success: true}
                }
                props.handleNotification('error', 'The request was incorrect')
            }
            console.info('[ App.jsx - patchUser ] error, API operation was unsuccessful')
            return {
                success: false,
                status: response.status
            }
        } catch (e) {
            console.error('There was an error',e.message)
            props.handleNotification('error', 'Server Error, sorry')
            return {
                success: false,
            }
        }
    }

    return (
        <div className="profile-container__wrapper">
            <div className={'profile'}>
                <div className="profile-container">
                    <header className="section-header">
                        <h1>Profile - {props.user.username}</h1>
                    </header>
                    {isEditing ?
                        <div className="profile-item__container">
                            <label>Name</label>
                            <input type={'text'} value={editUser.username} onChange={(e) => {
                                setEditUser({...editUser, username: e.target.value})
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
                                setEditUser({...editUser, email: e.target.value})
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
                            <textarea className={'profile-item-container__bio__edit'} value={editUser.bio}
                                      style={{borderBottom: '1px solid var(--secondary)'}} onChange={(e) => {
                                setEditUser({...editUser, bio: e.target.value})
                            }}></textarea>

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
                                }}>cancel
                                </button>

                                <button className={'general-button success-button'} onClick={async () => {
                                    const response = await patchUser(editUser)
                                    if (!response.success) {
                                        switch (response.status) {
                                            case 404:
                                                resetEditUser()
                                                props.handleNotification('error', 'Your user-auth does not exist')
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
                                }}>Save
                                </button>

                            </>
                            :
                            <>
                                <button type={'button'} className={'general-button success-button'} onClick={() => {
                                    setEditing(prevState => !prevState);
                                }}>Edit
                                </button>
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
        </div>
    </div>
)
}
