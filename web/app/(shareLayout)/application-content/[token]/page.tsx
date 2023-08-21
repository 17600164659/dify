"use client"
import React, { useState } from "react"
import { Button } from "antd"

import { Title } from "@/app/components/application-content/Title"
import "@/app/components/application-content/styles/main.scss"
import { CreateBox } from "@/app/components/application-content/CreateBox"
import { SaveBox } from "@/app/components/application-content/SaveBox"

const MainPage = () => {
  const [activeButton, setActiveButton] = useState("create")
  const handleCreateButtonClick = () => {
    setActiveButton("create")
  }
  const handleSaveButtonClick = () => {
    setActiveButton("save")
  }

  return (
    <>
      <Title />
      <div className="main-box">
        <div className="button-box">
          <Button
            className={
              activeButton === "create" ? "new selected" : "new normal"
            }
            onClick={handleCreateButtonClick}
          >
            创建
          </Button>
          <Button
            className={
              activeButton === "save" ? "saved selected" : "saved normal"
            }
            onClick={handleSaveButtonClick}
          >
            已保存
          </Button>
        </div>
        {activeButton === "create" ? <CreateBox /> : <SaveBox />}
      </div>
    </>
  )
}

export default React.memo(MainPage)
