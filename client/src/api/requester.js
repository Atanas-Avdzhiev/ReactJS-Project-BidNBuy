export default async function requester(method, url, data) {

    const options = {};

    const accessToken = JSON.parse(localStorage.getItem('auth'))?.accessToken;

    if (accessToken) {
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