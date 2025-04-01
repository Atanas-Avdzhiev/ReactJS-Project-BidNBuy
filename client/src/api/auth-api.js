import requester from "./requester";
import BASE_URL_BidNBuy from "../config";

const BASE_URL = `${BASE_URL_BidNBuy}/users`;

export const login = (email, password) => requester('POST', `${BASE_URL}/login`, { email, password });

export const register = (email, password, phone) => requester('POST', `${BASE_URL}/register`, { email, password, phone });

export const logout = () => requester('GET', `${BASE_URL}/logout`);

export const saveUser = async (email, accessToken, phone) => {
    try {
        const response = await fetch(`${BASE_URL_BidNBuy}/data/savedUsers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': accessToken
            },
            body: JSON.stringify({ email, phone, accessToken })
        })
        const savedUser = await response.json();
        return savedUser;
    } catch (err) {
        console.log(err.message)
    }
}

export const getUser = async (email) => {
    try {
        const response = await requester('GET', `${BASE_URL_BidNBuy}/data/savedUsers?where=email%3D%22${email}%22&pageSize=1`)
        return response[0];
    } catch (err) {
        console.log(err.message);
    }
};

export const editUser = async (userId, accessToken) => {
    try {
        const response = await fetch(`${BASE_URL_BidNBuy}/data/savedUsers/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': accessToken
            },
            body: JSON.stringify({ accessToken })
        })
        const editedUser = await response.json();
        return editedUser;
    } catch (err) {
        console.log(err.message)
    }
}

export const editProfile = (savedUserId, userData) => {
    const response = requester('PATCH', `${BASE_URL_BidNBuy}/data/savedUsers/${savedUserId}`, userData);
    return response;
};