const pathnames = window.location.pathname.split('/')
const id = pathnames[pathnames.length - 1];
console.log(id, 23232323)
export const decisionAppId = id === 'vEJdIfCYoHvn9peR' ? 'r3svUVKo2HJy6ncr' : 'HsvT57j5bktvP4sw';

const roleList = [];

if (window.location.hostname === 'localhost') {
    roleList.push({
        id,
        name: '测试AI',
        icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
    });
} else if (window.location.hostname === 'gpt.metaio.cc') {
    roleList.push({
        id,
        name: '测试AI',
        icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
    });
} else {
    roleList.push({
        id: 'vEJdIfCYoHvn9peR',
        name: 'Web3助手',
        icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
    });
    roleList.push({
        id: '4BFHbBYoeX7hfNGv',
        name: '通用AI助手',
        icon: 'https://assets.metaio.cc/assets/difyassets/logo.png'
    });
    if (id !== 'vEJdIfCYoHvn9peR') {
        roleList.push({
            id,
            name: '测试AI',
            icon: 'https://assets.metaio.cc/assets/difyassets/web3zs.png'
        });
    }
}

export const roles = roleList;