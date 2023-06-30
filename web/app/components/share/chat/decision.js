import { sendChatMessage } from '@/service/share'
import { getData } from './cryptocompare';
import { decisionAppId, appId } from './constants';

export function decision(data, isInstalledApp, installedAppInfo) {
    if (appId === '39ks4DBEUoLibDUd' || appId === 'mv1Wjowbvz51kLWH') return Promise.resolve(JSON.stringify({ type: 'Unanswerable' }));
    return new Promise((resolve, reject) => {
        let content = '';
        sendChatMessage({
            ...data,
            conversation_id: null,
        }, {
            async onData(message) {
                content = content + message;
            },
            async onCompleted(hasError) {
                resolve(content);
            },
            onError(e) {
                reject(e);
            },
        }, false, installedAppInfo?.id, `bearer ${decisionAppId}`)
    })
}

export async function execute(decisionJson, data) {
    const { type } = decisionJson;
    if (type === 'Null') return '';
    try {
        const result = await getData({ ...decisionJson, ...data });
        if (result.status === 200 && result.data && result.data.code === 200) {
            return result.data.data.text;
        }
        return '';
    } catch (e) {
        console.log(e, 23232323)
        return '';
    }
}
