import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

import { useLogout } from '../../hooks/useAuth'

export default function Logout() {

    const navigate = useNavigate();
    const logout = useLogout();

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