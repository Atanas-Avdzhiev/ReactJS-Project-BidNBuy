import requester from "./requester";

const BASE_URL = 'http://localhost:3030/users';

export const login = (email, password) => requester('POST', `${BASE_URL}/login`, { email, password });

export const register = (email, password) => requester('POST', `${BASE_URL}/register`, { email, password });

export const logout = () => requester('GET', `${BASE_URL}/logout`);