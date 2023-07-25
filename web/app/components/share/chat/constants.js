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
        id: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4YmMxMTQxOS1kNmE5LTQ3YWUtOTVhYi1lZWNhNmE4ZDFiNDAiLCJzdWIiOiJXZWIgQVBJIFBhc3Nwb3J0IiwiYXBwX2lkIjoiOGJjMTE0MTktZDZhOS00N2FlLTk1YWItZWVjYTZhOGQxYjQwIiwiZW5kX3VzZXJfaWQiOiIzNzUxNTczYy0zZGM2LTRiZDMtOGMzMy1mOTliNTVkYmNkMTgifQ.pn_ceXUZ4DvyLLkoPoqqsr2zE-8zIQXGQxjcy4lkNWM",
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
        id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzOGVhY2EzNy03ZTYzLTQ2ZjItODUyYy1hZDI1OWM5MWUyNDIiLCJzdWIiOiJXZWIgQVBJIFBhc3Nwb3J0IiwiYXBwX2lkIjoiMzhlYWNhMzctN2U2My00NmYyLTg1MmMtYWQyNTljOTFlMjQyIiwiZW5kX3VzZXJfaWQiOiJiOTM2YWYyYS1mZTY2LTQyYzEtYjA4MC0yNzEyNTJmZTEyMTMifQ.xVv6jD66y4k6NsSInSmJAt5HTaOf_qu2OLANimPqEQM',
        name: 'Web3助手',
        icon: 'https://assets.metaio.cc/assets/difyassets/logo.png'
    });
    roles.push({
        id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlM2Q5Y2Q0YS1kNzAxLTQ2YjAtYTg5OC02MmZmMTkwZDkxY2UiLCJzdWIiOiJXZWIgQVBJIFBhc3Nwb3J0IiwiYXBwX2lkIjoiZTNkOWNkNGEtZDcwMS00NmIwLWE4OTgtNjJmZjE5MGQ5MWNlIiwiZW5kX3VzZXJfaWQiOiIxYzNlNmU3Yy01NzYwLTQyMmUtODhlNy03MDQ4MTNjMGRiZDAifQ.cKxPLYqsYF1BJufs3FbnJwxhltiy4euh_wDpbgVyyNM',
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
