export default function AdminNavigation({adminView, setAdminView}) {
    return (
        <div className="admin-navigation">
            <a className={adminView === 'software'? "admin-navigation__link disabled-button" : "admin-navigation__link"}
                onClick={() => setAdminView('software')}>
                Software Install
            </a>
            <a className={adminView === 'firewall'? "admin-navigation__link disabled-button" : "admin-navigation__link"}
               onClick={() => setAdminView('firewall')}>
                firewall
            </a>
        </div>
    )
}