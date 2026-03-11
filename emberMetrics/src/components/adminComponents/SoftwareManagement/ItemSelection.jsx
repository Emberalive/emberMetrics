export default function ItemSelection({selectedItem, setSelectedItem, items, title}) {
    const itemList = items.map(item => {
        return (
            <div className={selectedItem === item.name? 'admin-selection__item disabled-selection': 'admin-selection__item'} key={item.name}
                 onClick={() =>setSelectedItem(item.name)}>
                <p>{item.name}</p>
            </div>
        )
    })
    return (
        <div className="admin-selection__container">
            <header>
                <p>Please select Your {title}</p>
            </header>
            <div className="admin-selection__items">
                {itemList}
            </div>
        </div>
    )
}