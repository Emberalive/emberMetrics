import {useState} from "react";

export default function UserManagement({users, allDevices}) {
    let userList =[]
    const [editUserDevices, setEditUserDevices] = useState(false)

    if (Array.isArray(users)) {
        userList = users.map((user) => {
            const userDeviceIds = new Set(user.devices.map(d => d.id));
            const userSpecificDeviceOptions = allDevices.filter(globalDevice => !userDeviceIds.has(globalDevice.id));            const allDeviceOptions = userSpecificDeviceOptions.map((device) => {
                return <option key={device.id} value={device.id}>{device.name}</option>
            })

            const userDevices = user.devices.map((device) => {
                return (
                        <div key={device.id} className={'user-container-item__details__entry'}>
                            <label>{device.name}</label>
                            <p>{device.ip}</p>
                        </div>
                )
            })
            return (
                <div key={user.id} className={'users-container__item'}>
                    <div className={'user-container-item__name'}>
                        <p>{user.username}</p>
                    </div>
                    <div className={'user-container-item__details'}>
                        <div className={'user-container-item__details__entry'}>
                            <label>Email:</label>
                            <p>{user.email}</p>
                        </div>
                        <div className={'user-container-item__details__entry'}>
                            <label>Bio:</label>
                            <p>{user.bio}</p>
                        </div>
                        <div className={'user-container-item__details__entry'}>
                            <label>Role:</label>
                            <p>{user.role}</p>
                        </div>
                        {editUserDevices === user.id ?
                            <div className={'user-container-item__details__devices'}>
                            <h3>Allowed Devices</h3>
                            {userDevices}
                                <select>
                                    {allDeviceOptions}
                                </select>
                            <div className={'user-container-item__details__devices-controls'}>
                                <button className={'general-button success-button'} onClick={() => {
                                    console.log('[ Client - UserManagement ] adding device')
                                }}>Add
                                </button>
                                <button className={'general-button danger-button'} onClick={() => {
                                    console.log('[ Client - UserManagement ] canceling user management')
                                    setEditUserDevices(null)
                                }}>Cancel
                                </button>
                            </div>
                        </div>
                        :
                            <div className={'user-container-item__details__devices'}>
                                <h3>Allowed Devices</h3>
                                {userDevices}
                                <div className={'user-container-item__details__devices-controls'}>
                                    <button className={'general-button'} onClick={() => {
                                        setEditUserDevices(user.id)
                                    }}>Edit
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            )
        })
    }
    return (
        <div className={'user-management'}>
            <header className={'section-header'}>
                <h1>User Management</h1>
            </header>
            <div className={'users-container__item'}>
                <div className={'user-container__header'}>
                    <p>Name</p>
                </div>
                <div className={'user-container__header'}>
                    <p>Details</p>
                </div>
            </div>
            <div className={'users-container'}>
                {userList}
            </div>
        </div>
    )
}