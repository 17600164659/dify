'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FilePreview from '../file-preview'
import FileUploader from '../file-uploader'
import NotionPagePreview from '../notion-page-preview'
import EmptyDatasetCreationModal from '../empty-dataset-creation-modal'

import './customStyle.css';
import cn from 'classnames'
import s from './index.module.css'
import type { File } from '@/models/datasets'
import type { DataSourceNotionPage } from '@/models/common'
import { DataSourceType } from '@/models/datasets'
import Button from '@/app/components/base/button'
import { NotionPageSelector } from '@/app/components/base/notion-page-selector'

type IStepOneProps = {
  datasetId?: string
  dataSourceType: DataSourceType
  dataSourceTypeDisable: Boolean
  hasConnection: boolean
  onSetting: () => void
  file?: File
  updateFile: (file?: File) => void
  notionPages?: any[]
  updateNotionPages: (value: any[]) => void
  onStepChange: () => void
  changeType: (type: DataSourceType) => void
}

type Page = DataSourceNotionPage & { workspace_id: string }

type NotionConnectorProps = {
  onSetting: () => void
}
export const NotionConnector = ({ onSetting }: NotionConnectorProps) => {
  const { t } = useTranslation()

  return (
    <div className={s.notionConnectionTip}>
      <span className={s.notionIcon} />
      <div className={s.title}>{t('datasetCreation.stepOne.notionSyncTitle')}</div>
      <div className={s.tip}>{t('datasetCreation.stepOne.notionSyncTip')}</div>
      <Button className='h-8' type='primary' onClick={onSetting}>{t('datasetCreation.stepOne.connect')}</Button>
    </div>
  )
}

const dataSourceConfig = [
  { icon: 'https://assets.metaio.cc/assets/difyassets/ds-icons/ds-file.png', name: '本地文件', deascription: '已经整理好的文件', dataType: 'FILE' },
  // { disabled: true, icon: 'https://assets.metaio.cc/assets/difyassets/ds-icons/ds-notion.png', name: 'Notion', deascription: '导入Notion文档', dataType: 'NOTION' },
  { disabled: true, icon: 'https://assets.metaio.cc/assets/difyassets/ds-icons/ds-notion.png', name: 'Notion', deascription: '升级中...', dataType: 'COMMINGSOON' },
  { disabled: true, icon: 'https://assets.metaio.cc/assets/difyassets/ds-icons/ds-web.png', name: 'Web单页', deascription: '即将上线', dataType: 'COMMINGSOON' },
  { disabled: true, icon: 'https://assets.metaio.cc/assets/difyassets/ds-icons/ds-site.png', name: '网站', deascription: '即将上线', dataType: 'COMMINGSOON' },
  { disabled: true, icon: 'https://assets.metaio.cc/assets/difyassets/ds-icons/ds-git.png', name: 'GitHub', deascription: '即将上线', dataType: 'COMMINGSOON' },
  { disabled: true, icon: 'https://assets.metaio.cc/assets/difyassets/ds-icons/ds-google.png', name: 'Google Sheet', deascription: '即将上线', dataType: 'COMMINGSOON' },
  { disabled: true, icon: 'https://assets.metaio.cc/assets/difyassets/ds-icons/ds-wemo.png', name: 'WemoData', deascription: '即将上线', dataType: 'COMMINGSOON' },
  { disabled: true, icon: 'https://assets.metaio.cc/assets/difyassets/ds-icons/ds-twi.png', name: 'Twitter', deascription: '即将上线', dataType: 'COMMINGSOON' },
  { disabled: true, icon: 'https://assets.metaio.cc/assets/difyassets/ds-icons/ds-airt.png', name: 'Airtable', deascription: '即将上线', dataType: 'COMMINGSOON' },
];

const StepOne = ({
  datasetId,
  dataSourceType,
  dataSourceTypeDisable,
  changeType,
  hasConnection,
  onSetting,
  onStepChange,
  file,
  updateFile,
  notionPages = [],
  updateNotionPages,
}: IStepOneProps) => {
  const [_dataSourceType, setDataSourceType] = useState('FILE')
  const [showModal, setShowModal] = useState(false)
  const [showFilePreview, setShowFilePreview] = useState(true)
  const [currentNotionPage, setCurrentNotionPage] = useState<Page | undefined>()
  const { t } = useTranslation()

  const hidePreview = () => setShowFilePreview(false)

  const modalShowHandle = () => setShowModal(true)

  const modalCloseHandle = () => setShowModal(false)

  const updateCurrentPage = (page: Page) => {
    setCurrentNotionPage(page)
  }

  const hideNotionPagePreview = () => {
    setCurrentNotionPage(undefined)
  }

  useEffect(() => {
    console.log(_dataSourceType, 23232323);
  }, [_dataSourceType])

  return (
    <div className='flex w-full h-full'>
      <div className='grow overflow-y-auto relative'>
        <div style={{ position: 'inherit' }} className={s.stepHeader}>{t('datasetCreation.steps.one')}</div>
        <div className={s.form}>
          <div className={s.dataSourceTypeList} style={{ display: 'block', overflow: 'hidden' }}>
            {
              dataSourceConfig.map(config => (
                <div
                  className={cn(s.dataSourceItem, config.disabled && s.disabled, dataSourceType === config.dataType && s.active) + ' data-source-item'}
                  onClick={() => config.disabled ? null : setDataSourceType(config.dataType)}
                  style={dataSourceType === config.dataType ? { border: "1px solid #5A6478", color: "#181A24", float: 'left', marginBottom: 12 } : { float: 'left', marginBottom: 12 }}
                >
                  {/* <span className={cn(s.datasetIcon)} /> */}
                  <img className='data-source-item-icon' src={config.icon} />
                  <div className='data-source-item-info'>
                    <div className='data-source-item-title'>{config.name}</div>
                    <div className='data-source-item-discription'>{config.deascription}</div>
                  </div>
                </div>
              ))
            }
            {/* <div
              className={cn(s.dataSourceItem, s.disabled, dataSourceType === 'notion' && s.active) + ' data-source-item'}
            // onClick={() => setDataSourceType('notion')}
            >
              <span className={s.comingTag}>Coming soon</span>
              <img className='data-source-item-icon' src="https://assets.metaio.cc/assets/difyassets/notion.png" />
              <div className='data-source-item-info'>
                <div className='data-source-item-title'>{t('datasetCreation.stepOne.dataSourceType.notion')}</div>
                <div className='data-source-item-discription'>标注</div>
              </div>
            </div> */}
            <div
              className={cn(s.dataSourceItem, s.disabled, dataSourceType === 'web' && s.active) + ' data-source-item'}
              onClick={modalShowHandle}
              style={{ cursor: "pointer" }}
            >
              {/* <span className={cn(s.datasetIcon, s.web)} /> */}
              <img className='data-source-item-icon' src="https://assets.metaio.cc/assets/difyassets/add.png" />
              <div className='data-source-item-info'>
                <div className='data-source-item-title'>{t('datasetCreation.stepOne.emptyDatasetCreation')}</div>
                <div className='data-source-item-discription'>以空数据创建数据集</div>
              </div>
            </div>
          </div>
          {
            _dataSourceType === 'NOTION' && (
              <>
                {!hasConnection && <NotionConnector onSetting={onSetting} />}
                {hasConnection && (
                  <>
                    <div className='mb-8 w-[640px]'>
                      <NotionPageSelector value={notionPages.map(page => page.page_id)} onSelect={updateNotionPages} onPreview={updateCurrentPage} />
                    </div>
                    <Button disabled={!notionPages.length} className={s.submitButton} type='primary' onClick={onStepChange}>{t('datasetCreation.stepOne.button')}</Button>
                  </>
                )}
              </>
            )
          }
          {
            _dataSourceType === "FILE" && (
              <>
                <FileUploader onFileUpdate={updateFile} file={file} />
                <Button background="#181A24" disabled={!file} borderRadius={1000} className={s.submitButton} type='primary' onClick={onStepChange}>{t('datasetCreation.stepOne.button')}</Button>
              </>
            )
          }
          {/* {!datasetId && (
            <>
              <div className={s.dividerLine} />
              <div onClick={modalShowHandle} className={s.OtherCreationOption}>{t('datasetCreation.stepOne.emptyDatasetCreation')}</div>
            </>
          )} */}
        </div >
        <EmptyDatasetCreationModal show={showModal} onHide={modalCloseHandle} />
      </div >
      {file && <FilePreview file={file} />}
      {currentNotionPage && <NotionPagePreview currentPage={currentNotionPage} hidePreview={hideNotionPagePreview} />}
    </div >
  )
}

export default StepOne
