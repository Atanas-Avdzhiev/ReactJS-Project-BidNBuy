import { useState } from "react";

export default function usePersistedState(key, initialState) {
    const [state, setState] = useState(() => {
        const persistedAuth = localStorage.getItem(key);

        if (!persistedAuth) {
            return initialState;
        }

        return JSON.parse(persistedAuth);
    });

    const updateState = (value) => {

        if (value === null || value === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }

        setState(value);
    }

    return [state, updateState];
}