import {useState, useEffect} from "react";

type Props = {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchInput({value, onChange, placeholder, className = ""}: Props) {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => onChange(inputValue), 400);
        return () => clearTimeout(timeout);
    }, [inputValue]);

    return (
        <>
            <div className={`mb-6 w-full flex justify-center ${className}`}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder || "Поиск..."}
                    className="w-full sm:w-96 px-5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition text-sm shadow-sm"
                />
            </div>
        </>
    );
}