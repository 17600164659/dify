import axios from 'axios';

export const getData = async (query, headers) => {
    const params = {
        method: 'get',
        url: `https://chain.metaio.cc/decision?q=${query}`,
    }
    if (headers) {
        params.headers = headers;
    }
    const data = await axios(params);
    return data;
}
