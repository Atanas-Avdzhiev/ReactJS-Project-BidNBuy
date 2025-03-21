import { useContext } from "react";
import { login, logout, register, saveUser } from "../api/auth-api";
import { AuthContext } from "../contexts/authContext";

export const useLogin = () => {
    const { changeAuthState } = useContext(AuthContext);

    const loginHandler = async (email, password) => {
        const { password: _, ...result } = await login(email, password);

        changeAuthState(result);

        return result;
    }
    return loginHandler;
}

export const useRegister = () => {
    const { changeAuthState } = useContext(AuthContext);

    const registerHandler = async (email, password) => {
        const { password: _, ...result } = await register(email, password);
        changeAuthState(result);
        
        if (result.email && result.accessToken) {
            await saveUser(result.email, result.accessToken);
        }

        return result;
    }
    return registerHandler;
}

export const useLogout = () => {
    const { logout: localLogout } = useContext(AuthContext);

    const logoutHandler = async () => {
        await logout();
        await localLogout();
    }
    return logoutHandler;
}