import { Button } from 'antd'
import { PlusOutlined, StarOutlined } from '@ant-design/icons'
const NoSaved = () => {
  const handleCreateBtn = () => {
    // 显示抽屉？
  }
  return (
    <div className="no-saved-box">
      <StarOutlined style={{ color: '#5A6478' }} />
      <h4>您还没有保存结果</h4>
      <p>开始生成内容，您可以在这里找到保存的结果</p>
      <Button
        className="createButton"
        icon={<PlusOutlined />}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={handleCreateBtn}
      >
        开始生成内容
      </Button>
    </div>
  )
}
export { NoSaved }
