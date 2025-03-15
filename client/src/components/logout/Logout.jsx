import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom'

import { useLogout } from '../../hooks/useAuth'

export default function Logout() {
    const logout = useLogout();
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                await logout();
                setIsLoggedOut(true);
            } catch (err) {
                console.log(err.message);
            }
        })();
    }, []);

    if (isLoggedOut) {
        return <Navigate to="/login" />;
    }

    return null;
}