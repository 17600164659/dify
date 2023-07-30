import OSS from 'ali-oss';
import r from '@/utils/request';
const request = r('chain.metaio.cc');
const timeDiff = 60 * 60 * 8;

function fileToBlob(file) {
    // 创建 FileReader 对象
    let reader = new FileReader();
    return new Promise(resolve => {
        // FileReader 添加 load 事件
        reader.addEventListener('load', (e) => {
            let blob;
            if (typeof e.target.result === 'object') {
                blob = new Blob([e.target.result])
            } else {
                blob = e.target.result
            }
            resolve(blob)
        })
        // FileReader 以 ArrayBuffer 格式 读取 File 对象中数据
        reader.readAsArrayBuffer(file)
    })
}

async function fetchSTS() {
    const result = await request.post('/wobi/stsGen');
    if (result.data.code === 200 && result.data.data) {
        result.data.data.expiration = new Date(result.data.data.expiration).getTime() + timeDiff;
        window.localStorage.setItem('sts', JSON.stringify(result.data.data));
        return result.data.data;
    }
    throw new Error(result.data.msg);
}

const ossHeaders = {
    // 指定上传文件的类型。
    'Content-Type': 'text/html',
    // 指定该Object被下载时网页的缓存行为。
    'Cache-Control': 'no-cache',
    // 指定该Object被下载时的名称。
    'Content-Disposition': 'oss_download.txt',
    // 指定该Object被下载时的内容编码格式。
    'Content-Encoding': 'UTF-8',
    // 指定过期时间。
    // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT',
    // 指定Object的存储类型。
    'x-oss-storage-class': 'Standard',
    // 指定Object的访问权限。
    'x-oss-object-acl': 'private',
    // 设置Object的标签，可同时设置多个标签。
    // 'x-oss-tagging': 'Tag1=1&Tag2=2',
    // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
    'x-oss-forbid-overwrite': 'true',
};


async function getSts() {
    let sts = window.localStorage.getItem('sts');
    if (sts) {
        sts = JSON.parse(sts);
        const stsExpiration = new Date(sts.expiration)
        if (Date.now() >= stsExpiration) {
            return await fetchSTS();
        } else {
            return sts;
        }
    } else {
        return await fetchSTS();
    }
}

export default (onUploaded) => {
    return {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        async customRequest(info) {
            try {
                const sts = await getSts();
                const blob = await fileToBlob(info.file);
                const store = new OSS({
                    region: 'oss-cn-beijing',
                    accessKeyId: sts.accessKeyId,
                    accessKeySecret: sts.accessKeySecret,
                    bucket: 'wobiyiliao',
                    stsToken: sts.securityToken,
                });
                const result = await store.put(
                    `/uploaders/${info.file.name}`,
                    blob,
                );
                // console.log(result, 23232323)
                onUploaded(result);
            } catch (e) {
                console.log(e, 23232323)
            }
        },
        onChange(info) {
            // fileToBlob(info.file.originFileObj)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
}