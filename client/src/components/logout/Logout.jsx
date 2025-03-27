import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

import { useLogout } from '../../hooks/useAuth'

export default function Logout() {
    const logout = useLogout();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                await logout();
                navigate('/login');
            } catch (err) {
                console.log(err.message);
            }
        })();
    }, []);

    return null;
}