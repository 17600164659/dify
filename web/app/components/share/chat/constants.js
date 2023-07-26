const pathnames = window.location.pathname.split('/')
export const appId = pathnames[pathnames.length - 1];
const isDev = window.location.hostname === 'localhost' || window.location.hostname === 'gpt.metaio.cc';
export const decisionAppId = appId === 'vEJdIfCYoHvn9peR' ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiZjZlZGU0Mi1lMTgwLTQwY2YtODBiNC0xZWYzZmY0ZjFkYzYiLCJzdWIiOiJXZWIgQVBJIFBhc3Nwb3J0IiwiYXBwX2lkIjoiYmY2ZWRlNDItZTE4MC00MGNmLTgwYjQtMWVmM2ZmNGYxZGM2IiwiZW5kX3VzZXJfaWQiOiJkNDllNGZiNi1lN2U3LTQyNDktOWExMC1lODYxMzU0YzEyZTEifQ.wPNN5r5E2prI-eS1d3yL4iqYplZfU2TN30Ocd2FE2KY' : isDev ? '' : '';

export const roles = [];

if (window.location.hostname === 'localhost') {
    roles.push({
        id: appId,
        name: '测试AI',
        icon: 'https://assets.metaio.cc/assets/difyassets/logo.png'
    });
    roles.push({
        id: "ixusPoGgrhhD2g4a",
        name: '金亮',
        icon: 'https://assets.metaio.cc/assets/difyassets/gpt.png'
    });
} else if (window.location.hostname === 'gpt.metaio.cc') {
    roles.push({
        id: appId,
        name: '测试AI',
        icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
    });
} else {
    roles.push({
        id: 'vEJdIfCYoHvn9peR',
        name: 'Web3助手',
        icon: 'https://assets.metaio.cc/assets/difyassets/logo.png'
    });
    roles.push({
        id: '4BFHbBYoeX7hfNGv',
        name: 'GPT3.5',
        icon: 'https://assets.metaio.cc/assets/difyassets/gpt.png'
    });
    // roles.push({
    //     id: 'mv1Wjowbvz51kLWH',
    //     name: '联网AI助手',
    //     icon: 'https://assets.metaio.cc/assets/difyassets/lwaizs.png'
    // })
    if (appId !== 'vEJdIfCYoHvn9peR' || appId !== '4BFHbBYoeX7hfNGv' || appId != 'mv1Wjowbvz51kLWH') {
        roles.push({
            id: appId,
            name: '测试AI',
            icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
        });
    }
}
