'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { XMarkIcon } from '@heroicons/react/20/solid'
import s from './index.module.css'
import type { File } from '@/models/datasets'
import { fetchFilePreview } from '@/service/common'

type IProps = {
  file?: File
  notionPage?: any
  hidePreview: () => void
}

const FilePreview = ({
  file,
  hidePreview,
}: IProps) => {
  const { t } = useTranslation()
  const [previewContent, setPreviewContent] = useState('')
  const [loading, setLoading] = useState(true)

  const getPreviewContent = async (fileID: string) => {
    try {
      const res = await fetchFilePreview({ fileID })
      setPreviewContent(res.content)
      setLoading(false)
    }
    catch { }
  }

  const getFileName = (currentFile?: File) => {
    if (!currentFile)
      return ''

    const arr = currentFile.name.split('.')
    return arr.slice(0, -1).join()
  }

  useEffect(() => {
    if (file)
      getPreviewContent(file.id)
  }, [file])

  return (
    <div className={cn(s.filePreview)} style={{
      margin: 20, background: "#FFFFFF",
      boxShadow: "0px 0px 26px rgba(90, 100, 120, 0.12)",
      borderRadius: 16,
    }}>
      <div className={cn(s.previewHeader)}>
        <div className={cn(s.title)}>
          <span>{t('datasetCreation.stepOne.filePreview')}</span>
          <div className='flex items-center justify-center w-6 h-6 cursor-pointer' onClick={hidePreview}>
            <XMarkIcon className='h-4 w-4'></XMarkIcon>
          </div>
        </div>
        <div className={cn(s.fileName)}>
          <span>{getFileName(file)}</span><span className={cn(s.filetype)}>.{file?.extension}</span>
        </div>
      </div>
      <div className={cn(s.previewContent)}>
        {loading && <div className={cn(s.loading)} />}
        {!loading && (
          <div className={cn(s.fileContent)}>{previewContent}</div>
        )}
      </div>
    </div>
  )
}

export default FilePreview
