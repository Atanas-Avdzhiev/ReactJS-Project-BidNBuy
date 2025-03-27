import { useState } from "react";
import { logout } from "../api/auth-api";

export default function usePersistedState(key, initialState) {
    const [state, setState] = useState(() => {
        const persistedAuth = localStorage.getItem(key);

        if (!persistedAuth) {
            return initialState;
        }

        return JSON.parse(persistedAuth);
    });

    const updateState = async (value) => {
        try {
            if (value === null || value === undefined) {
                setState(null);
                await logout();
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(value));
                setState(value);
            }

        } catch (err) {
            console.log(err.message);
        }
    }

    return [state, updateState];
}