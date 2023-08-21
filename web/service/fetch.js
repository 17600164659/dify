import axios from 'axios';

async function getHandle(url, data, headers) {
    const params = {
        method: 'get',
        url,
        params: data,
    }
    if (headers) {
        params.headers = headers;
    }
    return axios(params);
}

async function postHandle(url, data, headers) {
    const params = {
        method: 'post',
        url,
        data,
    }
    if (headers) {
        params.headers = headers;
    }
    return axios(params);
}

export default {
    GET: getHandle,
    POST: postHandle,
}
