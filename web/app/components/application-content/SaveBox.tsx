import { useEffect, useState } from 'react'
import { Alert, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { NoSaved } from './NoSaved'
import { ResultBox } from './ResultBox'

import type { SavedContentRes } from '@/service/application-content/apis/content'
import {
  getContentPost,
} from '@/service/application-content/apis/content'

const SaveBox = () => {
  const [savedMessages, setSavedMessages] = useState<SavedContentRes[]>([])
  const [isLoading, setLoading] = useState(false)
  const [isError, setError] = useState(false)
  const getSavedData = async () => {
    try {
      // 调用查询已保存的数据的接口
      // const res: any = await fetchSavedMessage(false)
      // console.log(res.data)
      const res: any = await getContentPost()
      // console.log(res)
      setSavedMessages(res)
      setLoading(false)
      setError(false)
    }
    catch (error) {
      setLoading(false)
      setError(true)
    }
  }
  useEffect(() => {
    getSavedData()
  }, [])

  if (isError) {
    return (
      <Alert
        message="Error"
        description="数据加载错误"
        type="error"
        style={{ marginRight: '20px' }}
        showIcon
      />
    )
  }
  const loadingIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: '#181a24',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-0.75em',
        marginLeft: '-0.75em',
      }}
      rev={undefined}
    />
  )
  if (isLoading || savedMessages.length === 0)
    return <Spin indicator={loadingIcon} />

  return savedMessages.length !== 0
    ? (
      <div className="save-box">
        {savedMessages.map(item => (
          <ResultBox
            key={item.ContentId}
            content={item}
            activeButton="save"
            refreshData={getSavedData}
            messageId={item.messageId}
          />
        ))}
      </div>
    )
    : (
      <NoSaved />
    )
}
export { SaveBox }
