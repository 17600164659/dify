import axios from 'axios';

function getHandle(host) {
    return (path, data, headers) => {
        const params = {
            method: 'get',
            url: `https://${host}${path}`,
            params: data,
        }
        if (headers) {
            params.headers = headers;
        }
        return axios(params);
    }
}

function postHandle(host) {
    return (path, data, headers) => {
        const params = {
            method: 'post',
            url: `https://${host}${path}`,
            data,
        }
        if (headers) {
            params.headers = headers;
        }
        return axios(params);
    }
}

export default function (host) {
    return {
        get: getHandle(host),
        post: postHandle(host),
    }
}
