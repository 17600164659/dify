const pathnames = window.location.pathname.split('/')
const id = pathnames[pathnames.length - 1];
export const decisionAppId = id === 'vEJdIfCYoHvn9peR' ? 'r3svUVKo2HJy6ncr' : 'HsvT57j5bktvP4sw';

export const roles = [
    // {
    //     id: 'vEJdIfCYoHvn9peR',
    //     name: 'Web3助手',
    //     icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
    // },
    // {
    //     id: '4BFHbBYoeX7hfNGv',
    //     name: '通用AI助手',
    //     icon: 'https://assets.metaio.cc/assets/difyassets/logo.png'
    // },
    // {
    //     id: 'XswcKkbtD6VaAoVK',
    //     name: 'Web3助手',
    //     icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
    // },
    // {
    //     id: 'XswcKkbtD6VaAoVK',
    //     name: '通用AI助手',
    //     icon: 'https://assets.metaio.cc/assets/difyassets/logo.png'
    // },
];

if (window.location.hostname === 'localhost') {
    roles.push({
        id,
        name: '测试AI',
        icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
    });
} else if (window.location.hostname === 'gpt.metaio.cc') {
    roles.push({
        id,
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
        name: '通用AI助手',
        icon: 'https://assets.metaio.cc/assets/difyassets/logo.png'
    });
    if (id !== 'vEJdIfCYoHvn9peR') {
        roles.push({
            id,
            name: '测试AI',
            icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
        });
    }
}
