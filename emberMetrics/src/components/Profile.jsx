import { useState } from 'react'

export default function Profile (props) {
    const [isEditing, setEditing] = useState(false);
    const [editUser, setEditUser] = useState({
        username: props.user.username,
        email: props.user.email ? props.user.email : '',
        bio: props.user.bio ? props.user.bio : '',
        devices: [{name:"localhost",ip:"127.0.0.1",id:"DgxI77r32HDNeBfh0sK8B"},{name:"My Server",ip:"203.0.113.1",id:"vJiyG2kg0-qSAvnYsN8tk"}]
    });
    let allowedDevicesList
    if (editUser.devices) {
        const allowedDevices = editUser.devices

        allowedDevicesList = allowedDevices.map(device => {
            return (
                <div className={'profile-item__container'}>
                    <label >{device.name}</label>
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
            devices: [{name:"localhost",ip:"127.0.0.1",id:"DgxI77r32HDNeBfh0sK8B"},{name:"My Server",ip:"203.0.113.1",id:"vJiyG2kg0-qSAvnYsN8tk"}]
        })
    }

    function submitEdit () {
        try {
        //     empty
            console.info('submitted profile change')
        } catch {
            props.handleNotification('error', 'Server Error, sorry')
        }
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
                                <p>{props.user.username}</p>
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
                                <p>{props.user.email}</p>
                            </div>
                        }
                        {isEditing ?
                            <div className="profile-item__container">
                                <label>Bio</label>
                                <textarea style={{borderBottom: '1px solid var(--secondary)'}} value={editUser.bio} onChange={(e) => {
                                    setEditUser({ ...editUser, bio: e.target.value })
                                }}></textarea>

                            </div>
                            :
                            <div className="profile-item__container">
                                <h1>Bio</h1>
                                <textarea disabled>{props.user.bio}</textarea>
                            </div>
                        }
                    <div className="profile-button__container">
                        {isEditing ?
                            <>
                                <button className={'general-button danger-button'} onClick={() => {
                                    setEditing(prevState => !prevState);
                                    resetEditUser()
                                }}>cancel</button>

                                <button className={'general-button success-button'} onClick={() => {
                                    submitEdit()
                                    setEditing(prevState => !prevState)
                                    resetEditUser()
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
