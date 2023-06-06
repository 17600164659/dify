import { sendChatMessage } from '@/service/share'
import { getData } from './cryptocompare';
import { decisionAppId } from './constants';

export function decision(data, isInstalledApp, installedAppInfo) {
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

export async function execute(decisionJson) {
    const { type } = decisionJson;
    if (type === 'Null') return '';
    try {
        const data = await getData(decisionJson);
        if (data.status === 200 && data.data && data.data.code === 200) {
            return data.data.data.text;
        }
        return '';
    } catch (e) {
        return '';
    }
}
