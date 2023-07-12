import axios from 'axios';
const cryptocompare = {
    host: "min-api.cryptocompare.com",
    apiKey: "a60709a88e18385e041a533b31b481f5b796558c5b593ef857abd415c425680b",
}

export const getData = (data, headers) => {
    const params = {
        method: 'get',
        url: `https://chain.metaio.cc/decision`,
    }
    if (data) {
        params.params = data;
    }
    if (headers) {
        params.headers = headers;
    }
    return axios(params);
}

const getDataForCustomHost = (url, data, headers) => {
    const params = {
        method: 'get',
        url,
    }
    if (data) {
        params.params = data;
    }
    if (headers) {
        params.headers = headers;
    }
    return axios(params);
}


const postData = (path, data, headers) => {
    const params = {
        method: 'post',
        url: `https://${cryptocompare.host}${path}`,
    }
    if (data) {
        params.data = data;
    }
    if (headers) {
        params.headers = headers;
    }
    return axios(params);
}
