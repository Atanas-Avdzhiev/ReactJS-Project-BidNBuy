export default async function requester(method, url, data) {

    const options = {};

    const accessToken = JSON.parse(localStorage.getItem('auth'))?.accessToken;

    const isLogout = url.split('/')[url.split('/').length - 1] === 'logout';

    if ((accessToken && method !== 'GET') || isLogout) {
        options.headers = {
            ...options.headers,
            'X-Authorization': accessToken
        }
    }

    if (method !== 'GET') {
        options.method = method;
    }

    if (data) {
        options.headers = {
            ...options.headers,
            'Content-Type': 'application/json'
        }

        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (response.status === 204) {
        return;
    }

    const result = await response.json();

    if (result.message === 'Invalid access token') {
        localStorage.setItem('auth', null);
    }

    if (!response.ok) {
        throw result;
    }

    return result;

}