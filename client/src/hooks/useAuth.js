import { useContext } from "react";
import { editUser, getUser, login, logout, register, saveUser } from "../api/auth-api";
import { AuthContext } from "../contexts/authContext";

export const useLogin = () => {
    const { changeAuthState } = useContext(AuthContext);

    const loginHandler = async (email, password) => {
        const { password: _, ...result } = await login(email, password);

        if (result.email && result.accessToken) {
            const findUser = await getUser(result.email);
            const editedUser = await editUser(findUser._id, result.accessToken);
            changeAuthState(editedUser);
        }

        return result;
    }
    return loginHandler;
}

export const useRegister = () => {
    const { changeAuthState } = useContext(AuthContext);

    const registerHandler = async (email, password, phone) => {
        const { password: _, ...result } = await register(email, password, phone);

        if (result.email && result.accessToken) {
            const savedUser = await saveUser(result.email, result.accessToken, result.phone);
            changeAuthState(savedUser);
        }

        return result;
    }
    return registerHandler;
}

export const useLogout = () => {
    const { logout: localLogout } = useContext(AuthContext);

    const logoutHandler = async () => {
        await localLogout();
    }
    return logoutHandler;
}