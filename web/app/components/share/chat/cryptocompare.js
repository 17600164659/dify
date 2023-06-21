import axios from 'axios';
const cryptocompare = {
    host: "min-api.cryptocompare.com",
    apiKey: "a60709a88e18385e041a533b31b481f5b796558c5b593ef857abd415c425680b",
}

// 加密货币社交媒体: {type: "Socialize"}

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


// class CryptoCompare {

//     async Ranking() {
//         const data = await getData('/data/top/totaltoptiervolfull', {
//             tsym: 'USD',
//         });
//         const topData = data.data.Data.slice(0, 5).map((data) => ({
//             Name: data.CoinInfo.Name,
//             FullName: data.CoinInfo.FullName,
//             Internal: data.CoinInfo.Internal,
//             vollume_24hour: data.RAW.USD.VOLUME24HOUR,
//         }))
//         return topData;
//     }

//     async News(content) {
//         const data = await getData('/data/v2/news/', {
//             lang: "EN"
//         });
//         const { Data } = data.data;
//         return Data.slice(0, 5).map(item => ({
//             title: item.title,
//             body: item.body,
//         }));
//     }

//     async Price(coins) {
//         const coinsPrice = await getData('/data/pricemulti', {
//             fsyms: coins.map(coin => coin.toUpperCase()).join(','),
//             tsyms: 'USD,EUR',
//         });
//         return coinsPrice.data;
//     }

//     async Trend(coins) {
//         const coinsTrend = await getData('/data/tradingsignals/intotheblock/latest', {
//             fsyms: coins.map(coin => coin.toUpperCase()).join(','),
//         });
//         return coinsTrend.data.Data;
//     }

//     async Volume(coins) {
//         const coinsVolume = await getData('/data/exchange/histoday', {
//             tsym: coins.map(coin => coin.toUpperCase()).join(','),
//             limit: 1,
//         });
//         return coinsVolume.data.Data[1];
//     }

//     async Transaction(coins) {
//         const coinsTransaction = await getData('/data/tradingsignals/intotheblock/latest', {
//             fsym: coins.map(coin => coin.toUpperCase()).join(','),
//             limit: 1,
//         });
//         return coinsTransaction.data.Data;
//     }

//     async Socialize() {
//         const coinsSocialize = await getDataForCustomHost('http://chain.metaio.cc/twitter/twitters')
//         return coinsSocialize.data.data;
//     }
// }

// export default new CryptoCompare();