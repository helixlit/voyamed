"use client";


type Props = {
    country: any;
    show: boolean;
    onClose: () => void;
};

export default function PopUp({ country, show, onClose }: Props) {
    if (!country) return null;

    return (
        <div className="absolute right-0 z-50 top-0">
            <h2 className="text-lg font-semibold">
                {country.properties.name}
            </h2>
            <button onClick={onClose}>✕</button>
        </div>
    );
}