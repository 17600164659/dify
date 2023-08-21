import axios from 'axios';
import { VUE_APP_BASE_API } from '@/constants';

async function getHandle(type, data, headers) {
    const params = {
        method: 'get',
        url: VUE_APP_BASE_API,
        params: {
            args: data,
            type,
        },
    }
    let wemoUser = window.localStorage.getItem('wemo_user');
    if (wemoUser) {
        wemoUser = JSON.parse(wemoUser);
        // window.location.href = window.location.origin + '/signin';
        params.headers = {
            Wemoflowauthorization: `Bearer ${wemoUser.token}`
        };
    };
    if (headers) {
        params.headers = { ...params.headers, ...headers };
    }
    return axios(params);
}

async function postHandle(type, data, headers) {
    const params = {
        method: 'post',
        url: VUE_APP_BASE_API,
        data: {
            args: data,
            type
        },
    }
    let wemoUser = window.localStorage.getItem('wemo_user');
    if (wemoUser) {
        wemoUser = JSON.parse(wemoUser);
        // window.location.href = window.location.origin + '/signin';
        params.headers = {
            Wemoflowauthorization: `Bearer ${wemoUser.token}`
        };
    };
    if (headers) {
        params.headers = { ...params.headers, ...headers };
    }
    return axios(params);
}

export default {
    get: getHandle,
    post: postHandle,
}

