import {useState} from "react";

export default function PackageSelection({selectedManager, setSelectedManager}) {

    const packageManagers = [
        {name: "apt"},
        {name: "yum"},
        {name: "dnf"},
        {name: "pacman"},
        {name: "zypper"},
        {name: "emerge"},
        {name: "flatpak"},
    ];

    const packageManList = packageManagers.map(p => {
        return (
            <div className={selectedManager === p.name? 'admin-selection__item disabled-selection': 'admin-selection__item'} key={p.name}
                 onClick={() =>setSelectedManager(p.name)}>
                <p>{p.name}</p>
            </div>
        )
    })
    return (
        <div className="admin-selection__container">
            <header>
                <p>Please select Your package manager</p>
            </header>
            <div className="admin-selection__items">
                {packageManList}
            </div>
        </div>
    )
}