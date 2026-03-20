export default function SubNav({subView, setSubView, subNavList}) {


    const navList = subNavList.map((subNav) => {
        return (
            <a key={subNav} className={subView === subNav ? "admin-navigation__link disabled-button" : "admin-navigation__link"}
               onClick={() => setSubView(subNav)}>
                {subNav}
            </a>
        )
    })

    return (
        <div className="admin-navigation">
            {navList}
        </div>
    )
}