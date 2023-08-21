"use client"
import type { CSSProperties } from "react"
import { useEffect, useState } from "react"
import { Button, Drawer, Form, Input, Select } from "antd"
import TextArea from "antd/es/input/TextArea"
import { CaretRightOutlined, CloseOutlined } from "@ant-design/icons"
import { useBoolean, useGetState } from "ahooks"
import { sendCompletionMessage } from "@/service/share"
import { fetchAppParams } from "@/service/share"
interface Pps {
  onRunButtonClick: (
    data: string,
    messageId: string,
    formData: WhitePaperGeneratorFormData
  ) => void
}

// 定义WhitePaperGenerator表单数据类型
export interface WhitePaperGeneratorFormData {
  title: string
  type: string
  name: string
  prompt: string
}

type UserInputFormField = {
  label: string
  variable: "text"
  max_length: number
  required: boolean
  default: string
}

type UserSelectionFormField = {
  label: string
  variable: "option"
  options: string[]
  required: boolean
  default: string
}

type DynamicFormField =
  | { "text-input": UserInputFormField }
  | { select: UserSelectionFormField }

const InputBox = (props: Pps) => {
  const { onRunButtonClick } = props
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  //表单类型是WhitePaperGeneratorFormData
  const [form] = Form.useForm<WhitePaperGeneratorFormData>()
  // 用户自定义的表单数据
  const [formFields, setFormFields] = useState<DynamicFormField[]>([])
  const [inputItem, setInputItem] = useState([])
  const getDynamicFormField = async () => {
    const res: any = await fetchAppParams(false)
    console.log(res.user_input_form)
    const variableValues = res.user_input_form.map((item: DynamicFormField) => {
      if ("text-input" in item) {
        return item["text-input"].variable
      } else if ("select" in item) {
        return item["select"].variable
      }
    })
    console.log(variableValues)
    setInputItem(variableValues)
    setFormFields(res.user_input_form)
  }
  useEffect(() => {
    getDynamicFormField()
  }, [])

  const handleInputClick = async () => {
    setIsDrawerVisible(true)
  }
  const handleDrawerClose = () => {
    form.resetFields()
    setIsDrawerVisible(false)
  }
  const drawerHeaderStyle: CSSProperties = {
    textAlign: "center",
    borderBottom: "none",
    paddingTop: "20px",
    fontSize: "16px",
    lineHeight: "16px",
    fontWeight: "500",
  }
  const drawerBodyStyle: CSSProperties = {
    padding: "0 20px",
  }
  const drawerStyle: CSSProperties = {
    backgroundColor: "#F5F6F7",
  }
  // 是否生成出错了
  // const [isError, setError] = useState(false)
  // 生成的文本
  const [, setCompletionRes, getCompletionRes] = useGetState("")

  // megId
  let messageId = ""
  // 是否在响应中
  const [
    isResponsing,
    { setTrue: setResponsingTrue, setFalse: setResponsingFalse },
  ] = useBoolean(false)
  // 点击运行按钮
  const handleCreatButtonClick = async () => {
    // 不同app的表单字段不一样
    const formData = form.getFieldsValue()
    console.log(formData)
    const inputData = inputItem.reduce((userInput, inputItemName) => {
      if (formData.hasOwnProperty(inputItemName)) {
        userInput[inputItemName] = formData[inputItemName]
      }
      return userInput
    }, {})
    console.log(inputData)
    const queryData = `文章标题为${formData.title},文章类型为${formData.type},撰写人名称为${formData.name},书写内容为${formData.prompt}`
    const content = { inputs: inputData, query: queryData }
    // const content = { inputs: "", query: "" }
    const res: string[] = []
    let tempMessageId = ""
    setCompletionRes("")
    setResponsingTrue()
    sendCompletionMessage(
      content,
      {
        onData: (
          data: string,
          _isFirstMessage: boolean,
          { messageId }: any
        ) => {
          // console.log(data, _isFirstMessage, messageId)
          // Other false 07f76cab-ff02-4748-afd6-bd3ac7504487
          // 记录每次返回的messageId 以最后一次为准
          tempMessageId = messageId
          res.push(data)
          // 保存全部返回的data
          setCompletionRes(res.join(""))
        },
        onCompleted: () => {
          // console.log("completed")
          // 表示没有在生成了
          setResponsingFalse()
          // 保存最终的messageId
          messageId = tempMessageId
          form.resetFields()
          setIsDrawerVisible(false)
          onRunButtonClick(getCompletionRes(), messageId || "", formData)
        },
        onError() {
          setResponsingFalse()
          setIsDrawerVisible(false)
        },
      },
      false
    )
  }
  return (
    <>
      <Input
        className="input"
        placeholder="输入你的要求"
        suffix={
          <svg
            className="input-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 30 30"
            fill="none"
          >
            <path
              d="M1.09416 30C0.791909 29.9614 0.514009 29.8128 0.312574 29.5822C0.111138 29.3517 0 29.0549 0 28.7476C0 28.4402 0.111138 28.1434 0.312574 27.9129C0.514009 27.6823 0.791909 27.5338 1.09416 27.4951H28.9058C29.2081 27.5338 29.486 27.6823 29.6874 27.9129C29.8889 28.1434 30 28.4402 30 28.7476C30 29.0549 29.8889 29.3517 29.6874 29.5822C29.486 29.8128 29.2081 29.9614 28.9058 30H1.09416ZM23.9991 0.58272L26.8001 3.40822C27.1701 3.78368 27.3778 4.29157 27.3778 4.82097C27.3778 5.35037 27.1701 5.85827 26.8001 6.23372L9.04035 24.0885C8.85473 24.2742 8.63459 24.4212 8.39255 24.5209C8.15052 24.6206 7.89135 24.6711 7.6299 24.6696H3.93492C3.67149 24.6696 3.41885 24.5641 3.23257 24.3762C3.0463 24.1883 2.94165 23.9334 2.94165 23.6677V19.8402C2.94014 19.5765 2.99025 19.3151 3.08911 19.0709C3.18797 18.8268 3.33363 18.6047 3.51775 18.4174L21.198 0.58272C21.5702 0.209491 22.0737 0 22.5985 0C23.1234 0 23.6269 0.209491 23.9991 0.58272ZM5.42484 20.0406V22.1647H7.53058L24.7142 4.83099L22.6085 2.68682L5.42484 20.0406Z"
              fill="#7F8794"
            />
          </svg>
        }
        onClick={handleInputClick}
        // onBlur={() => {
        //   setIsFormVisible(false)
        // }}
      />
      <Drawer
        title="输入需求"
        open={isDrawerVisible}
        placement="bottom"
        onClose={handleDrawerClose}
        size="large"
        closeIcon={false}
        headerStyle={drawerHeaderStyle}
        bodyStyle={drawerBodyStyle}
        style={drawerStyle}
        extra={
          <CloseOutlined
            style={{ color: "#2A374C" }}
            onClick={handleDrawerClose}
            rev={undefined}
          />
        }
      >
        <Form className="input-form" form={form}>
          {formFields.map((item: DynamicFormField) => {
            if ("text-input" in item)
              return (
                <Form.Item
                  key={item["text-input"].variable}
                  name={item["text-input"].variable}
                  rules={[
                    {
                      required: item["text-input"].required,
                      message: "请输入必填字段",
                    },
                  ]}
                >
                  <Input
                    placeholder={item["text-input"].label}
                    maxLength={item["text-input"].max_length}
                  ></Input>
                </Form.Item>
              )
            if ("select" in item)
              return (
                <Form.Item
                  key={item.select.variable}
                  name={item.select.variable}
                  rules={[
                    {
                      required: item.select.required,
                      message: "请输入必填字段",
                    },
                  ]}
                >
                  <Select
                    placeholder={item.select.label}
                    options={item.select.options.map((i) => ({
                      value: i,
                      label: i,
                    }))}
                  ></Select>
                </Form.Item>
              )
          })}
          <Form.Item
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="文章标题" />
          </Form.Item>
          <Form.Item
            name="type"
            rules={[{ required: true, message: "请选择文章类型" }]}
          >
            <Select
              placeholder="文章类型"
              options={[{ value: "默认", label: "默认" }]}
            />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "请输入撰写人名称" }]}
          >
            <Input placeholder="撰写人名称" />
          </Form.Item>
          <Form.Item
            name="prompt"
            rules={[{ required: true, message: "请输入书写内容" }]}
          >
            <TextArea placeholder="书写内容" rows={5} showCount={true} />
          </Form.Item>
        </Form>
        <div
          className="button-box"
          style={{
            width: "335px",
            height: "40px",
            position: "absolute",
            bottom: "32px",
          }}
        >
          <Button
            type="primary"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "25px",
              backgroundColor: "#181A24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={<CaretRightOutlined rev={undefined} />}
            onClick={handleCreatButtonClick}
            loading={isResponsing}
          >
            <span>运行</span>
          </Button>
        </div>
      </Drawer>
    </>
  )
}
export { InputBox }
