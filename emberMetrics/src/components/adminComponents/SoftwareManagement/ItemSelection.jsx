export default function ItemSelection({selectedItem, setSelectedItem, items, title, columns, viewPort}) {
    let actualColumns
    if (viewPort < 700) {
        actualColumns = (columns - 1).toString();
    } else {
        actualColumns = columns.toString();
    }
    if (viewPort < 500 && columns > 3) {
        actualColumns = (columns - 2).toString();
    }

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
            <div style={{gridTemplateColumns: `repeat(${actualColumns}, 1fr)`}} className="admin-selection__items">
                {itemList}
            </div>
        </div>
    )
}