import React, { useState } from "react"
import { ContentBox } from "@/app/components/application-content/ContentBox"
import {
  InputBox,
  WhitePaperGeneratorFormData,
} from "@/app/components/application-content/InputBox"
import { ResultBox } from "@/app/components/application-content/ResultBox"
import { SaveContent } from "@/service/application-content/apis/content"

const CreateBox = () => {
  const [runData, setRunData] = useState<SaveContent>()
  const [messageId, setMessageId] = useState("")
  // 生成数据
  const handleRunButton = async (
    data: string,
    messageId: string,
    formData: WhitePaperGeneratorFormData
  ) => {
    // console.log(formData, data)
    const allData: SaveContent = { ...formData, content: data }
    setRunData(allData)
    console.log(messageId)
    setMessageId(messageId)
  }
  return (
    <>
      {runData ? (
        <ResultBox
          activeButton="create"
          content={runData}
          messageId={messageId}
          refreshData={() => {}}
        />
      ) : (
        <div className="content-box">
          <ContentBox />
        </div>
      )}
      <div className="input-box">
        <InputBox onRunButtonClick={handleRunButton} />
      </div>
    </>
  )
}
export { CreateBox }
