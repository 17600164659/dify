import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams, usePathname } from "next/navigation"
import cn from "classnames"
import Recorder from "js-audio-recorder"
import { useRafInterval } from "ahooks"
import { convertToMp3 } from "./utils"
import s from "./index.module.css"
import { StopCircle } from "@/app/components/base/icons/src/vender/solid/mediaAndDevices"
import {
  Loading02,
  XClose,
} from "@/app/components/base/icons/src/vender/line/general"
import { audioToText } from "@/service/share"

type VoiceInputTypes = {
  onConverted: (text: string) => void
  onCancel: () => void
}

const VoiceInput = ({ onCancel, onConverted }: VoiceInputTypes) => {
  const { t } = useTranslation()
  // 储存录音相关状态
  const recorder = useRef(
    new Recorder({
      sampleBits: 16,
      sampleRate: 16000,
      numChannels: 1,
      compiling: false,
    })
  )
  // canvas元素的引用
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  // Canvas2D的引用
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  // 储存当前动画帧的id
  const drawRecordId = useRef<number | null>(null)
  const [originDuration, setOriginDuration] = useState(0)
  const [startRecord, setStartRecord] = useState(false)
  const [startConvert, setStartConvert] = useState(false)
  // 得到当前的路径
  const pathname = usePathname()
  // 得到当前的参数
  const params = useParams()
  // 定时器
  const clearInterval = useRafInterval(() => {
    setOriginDuration(originDuration + 1)
  }, 1000)
  // 绘制图形
  const drawRecord = useCallback(() => {
    // 每个帧上调用drawRecord
    drawRecordId.current = requestAnimationFrame(drawRecord)
    // 非空断言
    const canvas = canvasRef.current!
    const ctx = ctxRef.current!
    // 当前语音分析的数据
    const dataUnit8Array = recorder.current.getRecordAnalyseData()
    const dataArray = [].slice.call(dataUnit8Array)
    const lineLength = parseInt(`${canvas.width / 3}`)
    const gap = parseInt(`${1024 / lineLength}`)
    // 设置指定矩形区域内（以点 (x, y) 为起点，范围是 (width, height)）所有像素变成透明，并擦除之前绘制的所有内容
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 通过清空子路径列表开始一个新路径
    ctx.beginPath()
    // 循环开始绘制
    let x = 0
    for (let i = 0; i < lineLength; i++) {
      let v =
        dataArray
          .slice(i * gap, i * gap + gap)
          .reduce((prev: number, next: number) => {
            return prev + next
          }, 0) / gap
      // 保证波形在适当范围内可见
      if (v < 128) v = 128
      if (v > 178) v = 178
      const y = ((v - 128) / 50) * canvas.height

      ctx.moveTo(x, 16)
      if (ctx.roundRect) ctx.roundRect(x, 16 - y, 2, y, [1, 1, 0, 0])
      else ctx.rect(x, 16 - y, 2, y)
      ctx.fill()
      x += 3
    }
    ctx.closePath()
  }, [])
  // 停止绘制
  const handleStopRecorder = useCallback(async () => {
    clearInterval()
    setStartRecord(false)
    setStartConvert(true)
    recorder.current.stop()
    drawRecordId.current && cancelAnimationFrame(drawRecordId.current)
    drawRecordId.current = null
    const canvas = canvasRef.current!
    const ctx = ctxRef.current!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const mp3Blob = convertToMp3(recorder.current)
    const mp3File = new File([mp3Blob], "temp.mp3", { type: "audio/mp3" })
    const formData = new FormData()
    formData.append("file", mp3File)

    let url = ""
    let isPublic = false
    // 拼接URL
    if (params.token) {
      url = "/audio-to-text"
      isPublic = true
    } else if (params.appId) {
      if (pathname.search("explore/installed") > -1)
        url = `/installed-apps/${params.appId}/audio-to-text`
      else url = `/apps/${params.appId}/audio-to-text`
    }
    // 转文本
    try {
      const audioResponse = await audioToText(url, isPublic, formData)
      onConverted(audioResponse.text)
      onCancel()
    } catch (e) {
      onConverted("")
      onCancel()
    }
  }, [])
  // 开始记录
  const handleStartRecord = async () => {
    try {
      await recorder.current.start()
      setStartRecord(true)
      setStartConvert(false)

      if (canvasRef.current && ctxRef.current) drawRecord()
    } catch (e) {
      onCancel()
    }
  }
  // 初始化画布？
  const initCanvas = () => {
    // 获取设备的像素比
    const dpr = window.devicePixelRatio || 1
    const canvas = document.getElementById(
      "voice-input-record"
    ) as HTMLCanvasElement

    if (canvas) {
      const { width: cssWidth, height: cssHeight } =
        canvas.getBoundingClientRect()

      canvas.width = dpr * cssWidth
      canvas.height = dpr * cssHeight
      canvasRef.current = canvas

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.scale(dpr, dpr)
        ctx.fillStyle = "rgba(209, 224, 255, 1)"
        ctxRef.current = ctx
      }
    }
  }
  if (originDuration >= 120 && startRecord) handleStopRecorder()

  useEffect(() => {
    initCanvas()
    handleStartRecord()
  }, [])

  const minutes = parseInt(`${parseInt(`${originDuration}`) / 60}`)
  const seconds = parseInt(`${originDuration}`) % 60

  return (
    <div className={cn(s.wrapper, "absolute inset-0 rounded-xl")}>
      <div className="absolute inset-[1.5px] flex items-center pl-[14.5px] pr-[6.5px] py-[14px] bg-primary-25 rounded-[10.5px] overflow-hidden">
        <canvas
          id="voice-input-record"
          className="absolute left-0 bottom-0 w-full h-4"
        />
        {startConvert && (
          <Loading02 className="animate-spin mr-2 w-4 h-4 text-primary-700" />
        )}
        <div className="grow">
          {startRecord && (
            <div className="text-sm text-gray-500">
              {t("common.voiceInput.speaking")}
            </div>
          )}
          {startConvert && (
            <div className={cn(s.convert, "text-sm")}>
              {t("common.voiceInput.converting")}
            </div>
          )}
        </div>
        {startRecord && (
          <div
            className="flex justify-center items-center mr-1 w-8 h-8 hover:bg-primary-100 rounded-lg  cursor-pointer"
            onClick={handleStopRecorder}
          >
            <StopCircle className="w-5 h-5 text-gray-700" />
          </div>
        )}
        {startConvert && (
          <div
            className="flex justify-center items-center mr-1 w-8 h-8 hover:bg-gray-200 rounded-lg  cursor-pointer"
            onClick={onCancel}
          >
            <XClose className="w-4 h-4 text-gray-500" />
          </div>
        )}
        <div
          className={`w-[45px] pl-1 text-xs font-medium ${
            originDuration > 110 ? "text-[#F04438]" : "text-gray-700"
          }`}
        >{`0${minutes.toFixed(0)}:${
          seconds >= 10 ? seconds : `0${seconds}`
        }`}</div>
      </div>
    </div>
  )
}

export default VoiceInput
