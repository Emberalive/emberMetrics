export default function UserManagement({users}) {
    let userList =[]
    if (Array.isArray(users)) {
        userList = users.map((user) => {
            return (
                <div className={'users-container__item'}>
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