import { useState } from 'react'
import produce from 'immer'
import type { ConversationItem } from '@/models/share'

const storageConversationIdKey = 'conversationIdInfo'

type ConversationInfoType = Omit<ConversationItem, 'inputs' | 'id'>
function useConversation() {
  // 会话列表
  const [conversationList, setConversationList] = useState<ConversationItem[]>(
    [],
  )
  // 置顶的会话列表
  const [pinnedConversationList, setPinnedConversationList] = useState<
  ConversationItem[]
  >([])
  // 当前的会话 ID，初始值为'-1'
  const [currConversationId, doSetCurrConversationId] = useState<string>('-1')
  // when set conversation id, we do not have set appId
  // 设置当前的会话 ID。如果 isSetToLocalStroge 为 true 并且 ID 不为 '-1'，则会将会话 ID 保存到本地存储中
  const setCurrConversationId = (
    id: string,
    appId: string,
    isSetToLocalStroge = true,
    newConversationName = '',
  ) => {
    doSetCurrConversationId(id)
    if (isSetToLocalStroge && id !== '-1') {
      // conversationIdInfo: {[appId1]: conversationId1, [appId2]: conversationId2}
      const conversationIdInfo = globalThis.localStorage?.getItem(
        storageConversationIdKey,
      )
        ? JSON.parse(
          globalThis.localStorage?.getItem(storageConversationIdKey) || '',
        )
        : {}
      conversationIdInfo[appId] = id
      globalThis.localStorage?.setItem(
        storageConversationIdKey,
        JSON.stringify(conversationIdInfo),
      )
    }
  }
  // 从本地存储中获取指定应用的会话 ID
  const getConversationIdFromStorage = (appId: string) => {
    const conversationIdInfo = globalThis.localStorage?.getItem(
      storageConversationIdKey,
    )
      ? JSON.parse(
        globalThis.localStorage?.getItem(storageConversationIdKey) || '',
      )
      : {}
    const id = conversationIdInfo[appId]
    return id
  }
  // 新会话currConversationId为'-1'
  const isNewConversation = currConversationId === '-1'
  // input can be updated by user
  // 键为字符串、值为任何类型的对象，或者是 null
  const [newConversationInputs, setNewConversationInputs] = useState<Record<
  string,
  any
  > | null>(null)
  const resetNewConversationInputs = () => {
    if (!newConversationInputs)
      return
    // 将 newConversationInputs 中的所有属性的值都重置为空字符串
    setNewConversationInputs(
      produce(newConversationInputs, (draft) => {
        Object.keys(draft).forEach((key) => {
          draft[key] = ''
        })
      }),
    )
  }
  const [existConversationInputs, setExistConversationInputs] = useState<Record<
  string,
  any
  > | null>(null)
  const currInputs = isNewConversation
    ? newConversationInputs
    : existConversationInputs
  const setCurrInputs = isNewConversation
    ? setNewConversationInputs
    : setExistConversationInputs

  // info is muted
  const [newConversationInfo, setNewConversationInfo]
    = useState<ConversationInfoType | null>(null)
  const [existConversationInfo, setExistConversationInfo]
    = useState<ConversationInfoType | null>(null)
  const currConversationInfo = isNewConversation
    ? newConversationInfo
    : existConversationInfo

  return {
    conversationList,
    setConversationList,
    pinnedConversationList,
    setPinnedConversationList,
    currConversationId,
    setCurrConversationId,
    getConversationIdFromStorage,
    isNewConversation,
    currInputs,
    newConversationInputs,
    existConversationInputs,
    resetNewConversationInputs,
    setCurrInputs,
    currConversationInfo,
    setNewConversationInfo,
    setExistConversationInfo,
  }
}

export default useConversation
