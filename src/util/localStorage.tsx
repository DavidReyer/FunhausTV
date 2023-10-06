import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";

function getValueFromLocalStorage<T>(key: string): T | undefined {
    const stored = localStorage.getItem(key);
    if (stored === null) {
        return undefined;
    }

    try {
        return JSON.parse(stored) as T | undefined;
    } catch (e) {
        console.log("Error while loading from local storage", e);
    }
    return undefined;
}

export function useLocalStorageState<T>(
    key: string,
    defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
    const initialized = useRef(false);
    const [state, setState] = useState<T>(() => defaultValue);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            const stored = getValueFromLocalStorage<T>(key);
            if (stored !== undefined) {
                setState(stored);
                return;
            }
        }
        localStorage.setItem(key, JSON.stringify(state));
    }, [state, key]);

    return [state, setState];
}