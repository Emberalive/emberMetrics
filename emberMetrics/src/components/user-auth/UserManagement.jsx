import {useState} from "react";
import Select from 'react-select'

export default function UserManagement({users, allDevices}) {
    let userList =[]
    const [editUserDevices, setEditUserDevices] = useState(false)
    const [selectedAddDevice, setSelectedAddDevice] = useState({})

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
                            <div className={'user-container-item__details__devices-select'}>
                                <h3>New Device</h3>

                                <Select options={allDeviceOptions} styles={{
                                    container: (base) => ({
                                        ...base,
                                        width: '100%'
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
                                    control: (base) => ({
                                        ...base,
                                        backgroundColor: 'var(--neutral)',
                                        border: 'none',
                                        alignSelf: 'center',
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
                                    console.log(selectedOption)
                                    setSelectedAddDevice(selectedOption.value)
                                }}     noOptionsMessage={() => 'No more devices to give access'}/>
                                {(editUserDevices === user.id && selectedAddDevice !== {}) &&
                                    <>
                                        <div key={selectedAddDevice.id} className={'user-container-item__details__entry'}>
                                            <label>{selectedAddDevice.name}</label>
                                            <p>{selectedAddDevice.ip}</p>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className={'user-container-item__details__devices-controls'}>
                                <button className={'general-button success-button'} onClick={() => {
                                    console.log('[ Client - UserManagement ] adding device')
                                }}>Add
                                </button>
                                <button className={'general-button danger-button'} onClick={() => {
                                    console.log('[ Client - UserManagement ] canceling user-auth management')
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