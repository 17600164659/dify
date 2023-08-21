import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

type Response = {
    code: number,
    msg: string,
    data: any
}

const instance:AxiosInstance = axios.create({
  baseURL: 'https://chain.metaio.cc/gpt/textgen/',
  timeout: 10000,
})

// 添加请求拦截器
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')
//     if (token)
//       config.headers.Authorization = `Bearer ${token}`
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )
// 响应拦截
instance.interceptors.response.use(
    (response:AxiosResponse<Response>) => {
        // console.log(response);
        if (response.data.code !== 200){
            console.log('error');
        } else {
            return response.data.data
        }
    },
    (error) => {
        console.log(error);
        return Promise.reject(error.response)
    }
)

// 导出请求函数
export default function request<T extends { data?: T['data'] }>(
  url: string,
  config: AxiosRequestConfig,
): Promise<T['data']> {
  return instance.request({
    url,
    ...config,
  })
}
