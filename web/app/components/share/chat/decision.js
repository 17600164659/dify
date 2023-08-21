import { sendChatMessage } from '@/service/share'
import { getData } from './cryptocompare';
import { decisionAppId, appId } from './constants';
import request from '@/service/fetch';

export function decision(data, isInstalledApp, installedAppInfo) {
    if (appId === '39ks4DBEUoLibDUd' || appId === 'mv1Wjowbvz51kLWH') return Promise.resolve(JSON.stringify({ type: 'Unanswerable' }));
    if (!decisionAppId) return Promise.resolve(JSON.stringify({ type: 'Null' }))
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

export async function sendMessageAndNoSave(data) {
    return new Promise((resolve, reject) => {
        let content = '';
        sendChatMessage({
            ...data,
            conversation_id: null,
            decision_making: true,
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
        }, false, undefined)
    })
}

export async function pluginCall(data, strategys) {
    if (!strategys || !strategys.length) return "";
    const userQuery = data.query;
    let prompt = `你是一个决策引擎，现在有如下策略：\n\n`;
    strategys.map(strategy => {
        const straPrompt = {
            id: strategy.id,
            name: strategy.name,
            describe: strategy.prompt,
        };
        prompt += `${JSON.stringify(straPrompt)}\n`
    })

    prompt += '{id: -1, name: "默认", describe: "如果其它策略无法解决我的问题，请使用此策略"}\n'

    prompt += `请根据我的提问为我选择使用哪个策略。我的问题是：${userQuery}\n`;
    prompt += '请只回复我策略id，不要回答任何其它内容。';

    data.query = prompt;

    const result = await sendMessageAndNoSave(data);
    if (!result || result === '-1') {
        return "";
    }

    const useStrategy = strategys.find(stra => {
        return Number(stra.id) === Number(result);
    });
    if (useStrategy.plugins && useStrategy.plugins.length) {
        const pluginFetchs = useStrategy.plugins.map((plugin, index) => {
            const { url, method, bodyType } = plugin;
            const params = {};
            if (plugin.input && plugin.input.properties && plugin.input.properties.length) {
                plugin.input.properties.map(property => {
                    if (property.useUserInput) {
                        params[property.name] = userQuery;
                    } else {
                        params[property.name] = property.value;
                    }
                })
            }
            return request[method](url, params, { bodyType });
        });

        const results = await Promise.all(pluginFetchs);
        const datas = [];
        results.forEach((result, index) => {
            if (result.data && result.status === 200) {
                datas.push({
                    name: useStrategy.plugins[index].name,
                    data: result.data || {}
                });
            }
        })
        let returnPrompt = `{{{以下是插件提供的数据:\n`;
        datas.map(data => {
            returnPrompt += `插件${data.name}的数据是：${JSON.stringify(data.data)}\n`;
        })
        returnPrompt += `${useStrategy.prompt}}}}`;
        return returnPrompt;
    } else {
        return "";
    }
}
