const pathnames = window.location.pathname.split('/')
export const appId = pathnames[pathnames.length - 1];
const isDev = window.location.hostname === 'localhost' || window.location.hostname === 'cxctadmin.metaio.cc';
export const decisionAppId = appId === 'vEJdIfCYoHvn9peR' ? 'HsvT57j5bktvP4sw' : isDev ? '' : '';

export const roles = [];

if (window.location.hostname === 'localhost') {
    roles.push({
        id: appId,
        name: '测试AI',
        icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
    });
    roles.push({
        id: "EltAnP38Jx3RnzQG",
        name: '金亮',
        icon: 'https://assets.metaio.cc/assets/difyassets/gpt.png'
    });
} else if (window.location.hostname === 'cxctadmin.metaio.cc') {
    roles.push({
        id: appId,
        name: '测试AI',
        icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
    });
} else {
    roles.push({
        id: 'vEJdIfCYoHvn9peR',
        name: 'Web3助手',
        icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
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
