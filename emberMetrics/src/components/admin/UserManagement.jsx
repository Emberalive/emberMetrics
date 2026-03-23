import {useEffect, useState} from "react";
import Select from 'react-select'
import YouSure from "../shared/YouSure.jsx";

export default function UserManagement({users, allDevices, handleNotification, deviceType, hostIp, user, setUsers}) {
    let userList =[]
    const [editUserDevices, setEditUserDevices] = useState({
        id:''
    })
    const [selectedAddDevice, setSelectedAddDevice] = useState(false)
    const [selectedDeleteDevice, setSelectedDeleteDevice] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleUserDevice(action) {
        const isAdd = action === 'add';
        const selectedDevice = isAdd ? selectedAddDevice : selectedDeleteDevice;

        if (!selectedDevice || !editUserDevices) {
            handleNotification('error', `There was an issue ${isAdd ? 'granting' : 'revoking'} access, Please try again`);
            setEditUserDevices({id: ''})
            return;
        }

        const updatedDevices = isAdd
            ? [...editUserDevices.devices, selectedDevice]
            : editUserDevices.devices.filter(d => d.id !== selectedDevice.id);

        const userData = { ...editUserDevices, devices: updatedDevices };

        try {
            const response = await fetch(`http://${deviceType === "remote-access" ? hostIp : "127.0.0.1"}:3000/users/${isAdd ? 'addDevice' : 'removeDevice'}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    admin: user,
                    editUser: userData,
                    device: selectedDevice,
                }),
            });

            if (response.ok) {
                const resData = await response.json();
                if (resData.success) {
                    handleNotification('notice', `Updated ${editUserDevices.username}'s allowed devices: ${isAdd ? `added ${selectedDevice.name} to` : `removed ${selectedDevice.name} from`} allowed devices`);
                    const updatedUsers = users.map((u) => {
                        if (u.id === editUserDevices.id) {
                            return { ...u, devices: updatedDevices };
                        }
                        return u;
                    });
                    setUsers(updatedUsers);
                } else {
                    handleNotification('error', `Could not update ${editUserDevices.username}'s allowed devices`);
                }
            }

            setEditUserDevices({ id: '' });
            isAdd ? setSelectedAddDevice(false) : setSelectedDeleteDevice(false);

        } catch (e) {
            console.error(`[Client - ${isAdd ? 'addDevice' : 'deleteDevice'}] error:`, e);
            handleNotification('error', `Error ${isAdd ? 'adding' : 'deleting'} device`);
        }
    }

    if (Array.isArray(users)) {
        userList = users.map((user) => {
            const userSpecificDeviceOptions = allDevices.filter(globalDevice => !user.devices.some(device => device.id === globalDevice.id));
            const allDeviceOptions = userSpecificDeviceOptions.map((device) => {
                return {
                    value: device,
                    label: device.name
                }
            })

            const userDevices = user.devices.map((device) => {
                return (
                        <div key={device.id} className={'user-container-item__details__entry'}>
                            <label>{device.name}</label>
                            <p>{device.ip}</p>
                            {editUserDevices.id === user.id && <button className={'general-button danger-button'} onClick={() => {
                                //when created - pass the device through to the delete device function call
                                setIsDeleting(prevState => !prevState)
                                setSelectedDeleteDevice(device)
                            }}>X</button>}
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
                        {editUserDevices.id === user.id ?
                            <div className={'user-container-item__details__devices'}>
                            <h3>Allowed Devices</h3>
                            {userDevices}
                            <div className={'user-container-item__details__devices-select'}>
                                <h3>New Device</h3>

                                <Select options={allDeviceOptions} styles={{
                                    container: (base, state) => ({
                                        ...base,
                                        width: '100%',
                                        outline: 'none'
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: 'var(--accent)',
                                        fontFamily: "'Inter', sans-serif"
                                    }),
                                    dropdownIndicator: (base) => ({
                                        ...base,
                                        '&:hover': {
                                            color: 'var(--secondary)',
                                        }
                                    }),
                                    control: (base, state) => ({
                                        ...base,
                                        backgroundColor: 'var(--neutral)',
                                        outline: 'none',
                                        boxShadow: state.isFocused ? '0 0 0 1px var(--secondary)' : 'none',
                                        border: state.isFocused ? '1px solid var(--secondary)' : '1px solid var(--accent)',
                                        '&:hover': {
                                            border: '1px solid var(--secondary)',
                                        }
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isFocused ? 'var(--secondary-75)' : 'var(--neutral)',
                                        color: 'var(--accent)',
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        backgroundColor: 'var(--neutral)',
                                        borderRadius: '0 0 10px 10px',
                                        padding: '5px',
                                        borderBottom: '1px solid var(--tertiary)',
                                    })
                                }} onChange={(selectedOption) => {
                                    setSelectedAddDevice(selectedOption.value)
                                }}     noOptionsMessage={() => 'No more devices to give access'}/>
                                {(editUserDevices.id === user.id && selectedAddDevice !== false) &&
                                    <>
                                        <div key={selectedAddDevice.id} className={'user-container-item__details__entry'}>
                                            <label>{selectedAddDevice.name}</label>
                                            <p>{selectedAddDevice.ip}</p>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className={'user-container-item__details__devices-controls'}>
                                <button className={'general-button success-button'} onClick={async () => {
                                    await handleUserDevice('add');
                                }}>Add
                                </button>
                                <button className={'general-button danger-button'} onClick={() => {
                                    setEditUserDevices({
                                        id: ''
                                    })
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
                                        setEditUserDevices(user)
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
            {isDeleting && <YouSure cancelFunction={() => setIsDeleting(false)}
                                    message={`Do you want to revoke access of ${selectedDeleteDevice.name} from`}
                                    messageHighlight={editUserDevices.username}
                                    confirmFunction={async() => await handleUserDevice('delete')}/>}
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