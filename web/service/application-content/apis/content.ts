import request from "./request"

export type SaveContent = {
  title: string
  type: string
  name: string
  prompt: string
  content: string
}

export type SavedContentRes = {
  ContentId: string
  content: string
  createAt: number
  name: string
  prompt: string
  title: string
  type: string
  messageId: string
}

// 保存内容
export async function saveContentPost(data: SaveContent) {
  return request("/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  })
}

// 得到已保存的内容
export async function getContentPost() {
  return request("/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
}

// 删除已保存的内容
export async function deleteContentPost(cid: string) {
  return request("/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { cid: cid },
  })
}
