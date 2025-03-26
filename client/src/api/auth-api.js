import requester from "./requester";

// const BASE_URL = 'http://localhost:3030/users';
const BASE_URL = `${import.meta.env.VITE_API_URL}/users`;

export const login = (email, password) => requester('POST', `${BASE_URL}/login`, { email, password });

export const register = (email, password) => requester('POST', `${BASE_URL}/register`, { email, password });

export const logout = () => requester('GET', `${BASE_URL}/logout`);

export const saveUser = async (email, accessToken) => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/data/savedUsers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': accessToken
            },
            body: JSON.stringify({ email })
        })
    } catch (err) {
        console.log(err.message)
    }
}

export const getUser = async (email) => {
    const response = await requester('GET', `${import.meta.env.VITE_API_URL}/data/savedUsers?where=email%3D%22${email}%22&pageSize=1`)
    return response[0];
};