'use client'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import "./style.css";

export interface IPreviewItemProps {
  index: number
  content: string
}

const sharpIcon = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.74999 1.5L3.24999 10.5M8.74998 1.5L7.24998 10.5M10.25 4H1.75M9.75 8H1.25" stroke="#98A2B3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const textIcon = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 3.5H8M6 3.5V8.5M3.9 10.5H8.1C8.94008 10.5 9.36012 10.5 9.68099 10.3365C9.96323 10.1927 10.1927 9.96323 10.3365 9.68099C10.5 9.36012 10.5 8.94008 10.5 8.1V3.9C10.5 3.05992 10.5 2.63988 10.3365 2.31901C10.1927 2.03677 9.96323 1.8073 9.68099 1.66349C9.36012 1.5 8.94008 1.5 8.1 1.5H3.9C3.05992 1.5 2.63988 1.5 2.31901 1.66349C2.03677 1.8073 1.8073 2.03677 1.66349 2.31901C1.5 2.63988 1.5 3.05992 1.5 3.9V8.1C1.5 8.94008 1.5 9.36012 1.66349 9.68099C1.8073 9.96323 2.03677 10.1927 2.31901 10.3365C2.63988 10.5 3.05992 10.5 3.9 10.5Z" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

)

const PreviewItem: FC<IPreviewItemProps> = ({
  index,
  content,
}) => {
  const { t } = useTranslation()
  const charNums = (content || '').length
  const formatedIndex = (() => (index + '').padStart(3, '0'))()

  return (
    <div className='p-4 rounded-xl bg-gray-50 custom-data-list-item' style={{ background: '#F1F3F9', boxShadow: '0px 12px 24px rgba(241, 243, 249, 0.4)', borderRadius: 16 }}>
      <div className='custom-data-item-left'>
        <div className='custom-data-item-index'>
          <img />
          {formatedIndex}
        </div>

        <div className='custom-data-item-num'>
          <div className='custom-data-item-title'>字符数</div>
          <div className='custom-data-item-content'>{charNums}</div>
        </div>
      </div>
      {/* <div className='flex items-center justify-between h-5 text-xs text-gray-500'>
        <div className='flex items-center h-[18px] space-x-1 border border-gray-200 box-border rounded-md italic pl-1 pr-1.5 font-medium'>
          {sharpIcon}
          <span>{formatedIndex}</span>
        </div>
        <div className='flex items-center space-x-1'>
          {textIcon}
          <span>{charNums} {t('datasetCreation.stepTwo.characters')}</span>
        </div>
      </div> */}
      <div className='max-h-[120px] line-clamp-6 overflow-hidden text-sm text-gray-800'>
        <div style={{
          whiteSpace: 'pre-line',
          fontFamily: 'Microsoft YaHei',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: 12,
          color: '#181A24',
        }}>{content}</div>
      </div>
    </div>
  )
}
export default React.memo(PreviewItem)
