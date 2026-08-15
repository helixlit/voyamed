"use client"

import React, { useEffect, useState } from "react"

type Props = {
    filteredItems: Array<any>;

    query: string;
    setQuery: (value: string) => void;

    selectedItem: any;
    setSelectedItem: (value: any | null) => void;

    queryPrisma: (query: string) => Promise<Array<any>>;

    placeholder: string;
    divClassName: string;
    inputClassName: string;
    ulClassName: string;
    liClassName: string;
    selectedLiClassName: string;
}

export default function Search(props: Props) {
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);

    const [focused, setFocused] = useState<boolean>(false);


    useEffect(() => {
        if (!props.selectedItem) return;
        props.setQuery(props.selectedItem.name);
    }, [props.selectedItem]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedItemIndex((prev) => (
                    prev < props.filteredItems.length - 1 ? prev + 1 : 0
                ));
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedItemIndex((prev) => (
                    prev > 0 ? prev - 1 : props.filteredItems.length - 1
                ));
                break;
            case "Enter":
                e.preventDefault();
                const item = props.filteredItems[selectedItemIndex];
                props.setSelectedItem(item);
                break;
        };
    };

    const handleSelect = (item) => {
        props.setSelectedItem(item);
        props.setQuery(item.name);
    };

    useEffect(() => {
        console.debug("filteredItems");
        console.debug(props.filteredItems);
    }, [props.filteredItems]);

    return (
        <div className={props.divClassName}>
            <input
                type="text"
                onKeyDown={handleKeyDown}
                placeholder={props.placeholder}
                value={props.query}
                onChange={(e) => { props.setQuery(e.target.value) }}
                className={props.inputClassName}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            {focused && props.query && (
                <ul className={props.ulClassName}>
                    {props.filteredItems.length > 0 ? (
                        props.filteredItems.map((item, index) => {

                            if (index === selectedItemIndex) return (
                                <li key={item.id} className="flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#001219"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>
                                    <div
                                        onClick={() => handleSelect(item)}
                                        className={`
                                        cursor-pointer
                                        ${props.selectedLiClassName}
                                    `}
                                    >
                                        {item.name}
                                    </div>
                                </li>
                            );

                            return (
                                <li
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    className={`
                                        cursor-pointer
                                        ${props.liClassName}
                                    `}
                                >
                                    {item.name}
                                </li>
                            );
                        })
                    ) : (
                        <li key='li-no-results'>Keine Ergebnisse</li>
                    )}
                </ul>
            )}
        </div>
    );
}