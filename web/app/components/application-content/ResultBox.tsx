'use client'
import { Button, Modal, message } from 'antd'
import './styles/main.scss'
import {
  CopyOutlined,
  DeleteOutlined,
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import {
  deleteContentPost,
  saveContentPost,
} from '@/service/application-content/apis/content'
import { updateFeedback } from '@/service/share'

type ResultType = {
  content: any
  activeButton: string
  refreshData: () => void
  messageId: string
}

function useLikeUnlike() {
  const [like, setLike] = useState(false)
  const [unlike, setUnlike] = useState(false)
  const handleLike = async (messageId: string) => {
    // console.log(messageId)
    setLike(!like)
    setUnlike(false)
    await updateFeedback(
      {
        url: `/messages/${messageId}/feedbacks`,
        body: { rating: 'like' },
      },
      false,
    )
  }
  // const debouncedHandleLike = _.debounce(handleLike,500)
  const handleUnlike = async (messageId: string) => {
    // console.log(messageId)
    setUnlike(!unlike)
    setLike(false)
    await updateFeedback(
      {
        url: `/messages/${messageId}/feedbacks`,
        body: { rating: 'dislike' },
      },
      false,
    )
    // console.log(messageId)
  }
  return { like, unlike, handleLike, handleUnlike }
}

const ResultBox = (result: ResultType) => {
  const { content, activeButton, refreshData, messageId } = result
  console.log(messageId)

  const [messageApi, contextHolder] = message.useMessage()
  // 正在保存
  const [isSaveing, setIsSaving] = useState(false)
  // 正在删除
  const [isDeling, setIsDeling] = useState(false)
  const [saveButtonText, setSaveButtonText] = useState('保存')
  // 删除确认
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 保存按钮的星星
  const [star, setStar] = useState(<StarOutlined rev={undefined} />)
  // 背景颜色
  const [bColor, setBColor] = useState('#181A24')
  // 点赞
  const { like, unlike, handleLike, handleUnlike } = useLikeUnlike()

  // 点击复制
  const handleCopy = async () => {
    try {
      // 写入粘贴板
      await navigator.clipboard.writeText(result.content.content)
      messageApi.open({
        style: {
          marginTop: '20vh',
        },
        content: '已复制',
        type: 'success',
      })
    }
    catch (error) {
      messageApi.open({
        style: {
          marginTop: '20vh',
        },
        content: '复制失败',
        type: 'error',
      })
    }
  }

  // 点击保存
  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveButtonText('正在保存')
      // 调用保存接口
      await saveContentPost({ ...content, messageId })
      setIsSaving(false)
      setSaveButtonText('已保存')
      setStar(<StarFilled rev={undefined} />)
      setBColor('#757C89')
    }
    catch (error) {
      console.log(error)
      setIsSaving(false)
      setSaveButtonText('保存')
      messageApi.open({
        style: {
          marginTop: '20vh',
        },
        content: '保存失败',
        type: 'error',
      })
    }
  }
  // 点击删除
  const handleDel = () => {
    setIsModalOpen(true)
  }
  const delSavedData = async () => {
    try {
      await deleteContentPost(content.ContentId)
      refreshData()
    }
    catch (error) {
      setIsDeling(false)
      messageApi.open({
        style: {
          marginTop: '20vh',
        },
        content: '删除失败',
        type: 'error',
      })
    }
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="result-box">
        <div className="text-box">{content.content}</div>
        <div className="util-box">
          {contextHolder}
          <Button
            className="copy-btn"
            icon={<CopyOutlined rev={undefined} />}
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            复制
          </Button>
          {activeButton === 'create'
            ? (
              <Button
                className="change-btn"
                icon={star}
                loading={isSaveing}
                onClick={handleSave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${bColor}`,
                }}
              >
                {saveButtonText}
              </Button>
            )
            : (
              <Button
                className="change-btn"
                icon={<DeleteOutlined rev={undefined} />}
                loading={isDeling}
                onClick={handleDel}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
              删除
              </Button>
            )}

          <span className="len-span">{`${content.content.length}个字符`}</span>
        </div>
        <div className="like-box">
          <Button
            className="like-btn"
            icon={
              like
                ? (
                  <LikeFilled rev={undefined} />
                )
                : (
                  <LikeOutlined rev={undefined} />
                )
            }
            onClick={() => {
              handleLike(messageId || '')
            }}
          ></Button>
          <Button
            className="like-btn"
            icon={
              unlike
                ? (
                  <DislikeFilled rev={undefined} />
                )
                : (
                  <DislikeOutlined rev={undefined} />
                )
            }
            onClick={() => {
              handleUnlike(messageId || '')
            }}
          ></Button>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        centered={true}
        closeIcon={false}
        bodyStyle={{
          height: '50px',
        }}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={delSavedData}
            style={{
              width: '101px',
              backgroundColor: '#757C89',
              color: '#FFFFFF',
              borderRadius: '15px',
              marginRight: '98px',
            }}
          >
            确认并继续
          </Button>,
          <Button
            key="cancel"
            onClick={() => {
              setIsModalOpen(false)
            }}
            style={{
              width: '101px',
              backgroundColor: '#181A24',
              color: '#FFFFFF',
              borderRadius: '15px',
            }}
          >
            我再想想
          </Button>,
        ]}
      >
        <p
          style={{
            textAlign: 'center',
            color: '#2A374C',
            fontSize: '16px',
            lineHeight: '50px',
          }}
        >
          取消保存后，记录将无法找回
        </p>
      </Modal>
    </>
  )
}
export { ResultBox }
