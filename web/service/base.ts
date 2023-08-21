/* eslint-disable no-new, prefer-promise-reject-errors */
import { API_PREFIX, IS_CE_EDITION, PUBLIC_API_PREFIX } from '@/config'
import Toast from '@/app/components/base/toast'

const TIME_OUT = 100000

const ContentType = {
  json: 'application/json',
  stream: 'text/event-stream',
  form: 'application/x-www-form-urlencoded; charset=UTF-8',
  download: 'application/octet-stream', // for download
  upload: 'multipart/form-data', // for upload
}

// 默认的请求配置
const baseOptions = {
  // 方法默认为GET
  method: 'GET',
  // 允许跨域
  mode: 'cors',
  // 每次请求都会携带发送到该域的cookies
  credentials: 'include', // always send cookies、HTTP Basic authentication.
  // 请求头
  headers: new Headers({
    'Content-Type': ContentType.json,
  }),
  // 跟随重定向
  redirect: 'follow',
  // 和credentials: 'include'功能一样
  xhrFields: {
    withCredentials: true,
  },
}

export type IOnDataMoreInfo = {
  // 对话id
  conversationId?: string
  // 任务id
  taskId?: string
  // 消息id
  messageId: string
  errorMessage?: string
}

// 3个函数
export type IOnData = (message: string, isFirstMessage: boolean, moreInfo: IOnDataMoreInfo) => void
export type IOnCompleted = (hasError?: boolean) => void
export type IOnError = (msg: string) => void

type IOtherOptions = {
  // 公共API？
  isPublicAPI?: boolean
  // 请求体字符串化?
  bodyStringify?: boolean
  // 完整相应内容？
  needAllResponseContent?: boolean
  // 删除ContentType？
  deleteContentType?: boolean
  onData?: IOnData // for stream
  onError?: IOnError
  onCompleted?: IOnCompleted // for stream
  getAbortController?: (abortController: AbortController) => void
}

// Unicode 编码的字符转换为实际的字符
function unicodeToChar(text: string) {
  return text.replace(/\\u[0-9a-f]{4}/g, (_match, p1) => {
    return String.fromCharCode(parseInt(p1, 16))
  })
}

// 格式化字符串
export function format(text: string) {
  // 去除首尾空格
  let res = text.trim()
  if (res.startsWith('\n'))
    res = res.replace('\n', '')
  // \n换br
  return res.replaceAll('\n', '<br/>').replaceAll('```', '')
}

// 处理服务器返回的stream
const handleStream = (response: any, onData: IOnData, onCompleted?: IOnCompleted) => {
  // 检查网络
  if (!response.ok)
    throw new Error('Network response was not ok')
  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let bufferObj: any
  let isFirstMessage = true
  function read() {
    let hasError = false
    reader.read().then((result: any) => {
      if (result.done) {
        onCompleted && onCompleted()
        return
      }
      buffer += decoder.decode(result.value, { stream: true })
      const lines = buffer.split('\n')
      try {
        // 对每一行进行遍历
        lines.forEach((message) => {
          if (message.startsWith('data: ')) { // check if it starts with data:
            // console.log(message);
            try {
              // 去掉'data:'前缀
              bufferObj = JSON.parse(message.substring(6)) // remove data: and parse as json
            }
            catch (e) {
              // mute handle message cut off
              onData('', isFirstMessage, {
                conversationId: bufferObj?.conversation_id,
                messageId: bufferObj?.id,
              })
              return
            }
            if (bufferObj.status === 400 || !bufferObj.event) {
              onData('', false, {
                conversationId: undefined,
                messageId: '',
                errorMessage: bufferObj.message,
              })
              hasError = true
              onCompleted && onCompleted(true)
              return
            }
            // can not use format here. Because message is splited.
            onData(unicodeToChar(bufferObj.answer), isFirstMessage, {
              conversationId: bufferObj.conversation_id,
              taskId: bufferObj.task_id,
              messageId: bufferObj.id,
            })
            isFirstMessage = false
          }
        })
        buffer = lines[lines.length - 1]
      }
      catch (e) {
        onData('', false, {
          conversationId: undefined,
          messageId: '',
          errorMessage: `${e}`,
        })
        hasError = true
        onCompleted && onCompleted(true)
        return
      }
      // 递归调用
      if (!hasError)
        read()
    })
  }
  read()
}

// 发起网络请求
const baseFetch = (
  url: string,
  fetchOptions: any,
  {
    isPublicAPI = false,
    bodyStringify = true,
    needAllResponseContent,
    deleteContentType,
  }: IOtherOptions,
) => {
  // 相当于const options = {...baseOptions, ...fetchOptions}
  const options = Object.assign({}, baseOptions, fetchOptions)
  // 如果是公共API
  if (isPublicAPI) {
    // 得到URL的最后一项，不包括查询参数
    const sharedToken = globalThis.location.pathname.split('/').slice(-1)[0]
    // 到localStorage找token，没有token的话='{ [sharedToken]: '' }'
    const accessToken = localStorage.getItem('token') || JSON.stringify({ [sharedToken]: '' })
    // JSON格式
    let accessTokenJson = { [sharedToken]: '' }
    try {
      accessTokenJson = JSON.parse(accessToken)
    }
    catch (e) {

    }
    // 设置请求头的Authorization字段
    if (fetchOptions.params && fetchOptions.params.bearer) {
      // 如果有参数、参数中还有bearer字段
      options.headers.set('Authorization', `bearer ${fetchOptions.params.bearer}`)
    }
    else {
      options.headers.set('Authorization', `bearer ${accessTokenJson[sharedToken]}`)
    }
  }
  // 设置ContentType
  if (deleteContentType) {
    options.headers.delete('Content-Type')
  }
  else {
    const contentType = options.headers.get('Content-Type')
    // 默认ContentType格式为json
    if (!contentType)
      options.headers.set('Content-Type', ContentType.json)
  }
  // 根据公共API还是私有API选择前缀
  const urlPrefix = isPublicAPI ? PUBLIC_API_PREFIX : API_PREFIX
  // 拼接URL
  let urlWithPrefix = `${urlPrefix}${url.startsWith('/') ? url : `/${url}`}`

  const { method, params, body } = options
  // handle query
  // 如果是GET请求且有请求参数，就把请求参数拼接到URL中
  if (method === 'GET' && params) {
    const paramsArray: string[] = []
    Object.keys(params).forEach(key =>
      paramsArray.push(`${key}=${encodeURIComponent(params[key])}`),
    )
    if (urlWithPrefix.search(/\?/) === -1)
      urlWithPrefix += `?${paramsArray.join('&')}`

    else
      urlWithPrefix += `&${paramsArray.join('&')}`
    delete options.params
  }

  if (body && bodyStringify)
    options.body = JSON.stringify(body)

  // Handle timeout
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('request timeout'))
      }, TIME_OUT)
    }),
    new Promise((resolve, reject) => {
      globalThis.fetch(urlWithPrefix, options)
        .then((res: any) => {
          const resClone = res.clone()
          // Error handler
          if (!/^(2|3)\d{2}$/.test(res.status)) {
            const bodyJson = res.json()
            switch (res.status) {
              case 401: {
                if (isPublicAPI) {
                  Toast.notify({ type: 'error', message: 'Invalid token' })
                  return bodyJson.then((data: any) => Promise.reject(data))
                }
                const loginUrl = `${globalThis.location.origin}/signin`
                if (IS_CE_EDITION) {
                  bodyJson.then((data: any) => {
                    if (data.code === 'not_setup') {
                      globalThis.location.href = `${globalThis.location.origin}/install`
                    }
                    else {
                      if (location.pathname === '/signin') {
                        bodyJson.then((data: any) => {
                          Toast.notify({ type: 'error', message: data.message })
                        })
                      }
                      else {
                        globalThis.location.href = loginUrl
                      }
                    }
                  })
                  return Promise.reject()
                }
                globalThis.location.href = loginUrl
                break
              }
              case 403:
                new Promise(() => {
                  bodyJson.then((data: any) => {
                    Toast.notify({ type: 'error', message: data.message })
                    if (data.code === 'already_setup')
                      globalThis.location.href = `${globalThis.location.origin}/signin`
                  })
                })
                break
              // fall through
              default:
                new Promise(() => {
                  bodyJson.then((data: any) => {
                    Toast.notify({ type: 'error', message: data.message })
                  })
                })
            }
            return Promise.reject(resClone)
          }

          // handle delete api. Delete api not return content.
          if (res.status === 204) {
            resolve({ result: 'success' })
            return
          }

          // return data
          const data = options.headers.get('Content-type') === ContentType.download ? res.blob() : res.json()

          resolve(needAllResponseContent ? resClone : data)
        })
        .catch((err) => {
          Toast.notify({ type: 'error', message: err })
          reject(err)
        })
    }),
  ])
}
// 上传文件
export const upload = (options: any): Promise<any> => {
  const defaultOptions = {
    method: 'POST',
    url: `${API_PREFIX}/files/upload`,
    headers: {},
    data: {},
  }
  options = {
    ...defaultOptions,
    ...options,
    headers: { ...defaultOptions.headers, ...options.headers },
  }
  return new Promise((resolve, reject) => {
    const xhr = options.xhr
    xhr.open(options.method, options.url)
    for (const key in options.headers)
      xhr.setRequestHeader(key, options.headers[key])

    xhr.withCredentials = true
    xhr.responseType = 'json'
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 201)
          resolve(xhr.response)
        else
          reject(xhr)
      }
    }
    xhr.upload.onprogress = options.onprogress
    xhr.send(options.data)
  })
}

// 发起SSE类型的POST请求
export const ssePost = (url: string, fetchOptions: any, { isPublicAPI = false, onData, onCompleted, onError, getAbortController }: IOtherOptions, Authorization: string) => {
  // 用来终止请求
  const abortController = new AbortController()
  // 参数
  const options = Object.assign({}, baseOptions, {
    method: 'POST',
    signal: abortController.signal,
  }, fetchOptions)
  // 需要把传入的Authorization添加到请求头
  if (Authorization) {
    options.headers = new Headers({
      'Content-Type': ContentType.json,
      Authorization,
    })
  }

  if (isPublicAPI) {
    // 得到URL的最后一项，不包括查询参数
    const sharedToken = globalThis.location.pathname.split('/').slice(-1)[0]
    // 到localStorage找token，没有token的话='{ [sharedToken]: '' }'
    const accessToken = localStorage.getItem('token') || JSON.stringify({ [sharedToken]: '' })
    // JSON格式
    let accessTokenJson = { [sharedToken]: '' }
    try {
      accessTokenJson = JSON.parse(accessToken)
    }
    catch (e) {

    }
    // 设置请求头的Authorization字段
    if (fetchOptions.params && fetchOptions.params.bearer) {
      // 如果有参数、参数中还有bearer字段
      options.headers.set('Authorization', `bearer ${fetchOptions.params.bearer}`)
    }
    else {
      options.headers.set('Authorization', `bearer ${accessTokenJson[sharedToken]}`)
    }
  }

  // Content-Type默认为json
  const contentType = options.headers.get('Content-Type')
  if (!contentType)
    options.headers.set('Content-Type', ContentType.json)

  getAbortController?.(abortController)
  // 拼接url前缀
  const urlPrefix = isPublicAPI ? PUBLIC_API_PREFIX : API_PREFIX
  const urlWithPrefix = `${urlPrefix}${url.startsWith('/') ? url : `/${url}`}`

  const { body } = options
  if (body)
    options.body = JSON.stringify(body)
  // 发起请求
  globalThis.fetch(urlWithPrefix, options)
    .then((res: any) => {
      // debugger
      if (!/^(2|3)\d{2}$/.test(res.status)) {
        new Promise(() => {
          res.json().then((data: any) => {
            Toast.notify({ type: 'error', message: data.message || 'Server Error' })
          })
        })
        onError?.('Server Error')
        return
      }
      return handleStream(res, (str: string, isFirstMessage: boolean, moreInfo: IOnDataMoreInfo) => {
        if (moreInfo.errorMessage) {
          onError?.(moreInfo.errorMessage)
          if (moreInfo.errorMessage !== 'AbortError: The user aborted a request.')
            Toast.notify({ type: 'error', message: moreInfo.errorMessage })
          return
        }
        onData?.(str, isFirstMessage, moreInfo)
      }, onCompleted)
    }).catch((e) => {
      if (e.toString() !== 'AbortError: The user aborted a request.')
        Toast.notify({ type: 'error', message: e })

      onError?.(e)
    })
}

export const request = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return baseFetch(url, options, otherOptions || {})
}

export const get = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'GET' }), otherOptions)
}

// For public API
export const getPublic = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return get(url, options, { ...otherOptions, isPublicAPI: true })
}

export const post = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'POST' }), otherOptions)
}

export const postPublic = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return post(url, options, { ...otherOptions, isPublicAPI: true })
}

export const put = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'PUT' }), otherOptions)
}

export const putPublic = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return put(url, options, { ...otherOptions, isPublicAPI: true })
}

export const del = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'DELETE' }), otherOptions)
}

export const delPublic = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return del(url, options, { ...otherOptions, isPublicAPI: true })
}

export const patch = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'PATCH' }), otherOptions)
}

export const patchPublic = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return patch(url, options, { ...otherOptions, isPublicAPI: true })
}
