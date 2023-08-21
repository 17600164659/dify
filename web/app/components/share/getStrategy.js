import request from '@/service/request';

export default async (appId) => {
    const result = await request.post('/strategy/get', { appId })
    if (result.data && result.data.code === 200 && result.data.data && result.data.data.strategy) {
        return JSON.parse(result.data.data.strategy);
    }
    return [];
}