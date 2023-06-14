'use client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { File } from '@/models/datasets'
import FilePreview from '../file-preview'
import FileUploader from '../file-uploader'
import EmptyDatasetCreationModal from '../empty-dataset-creation-modal'
import Button from '@/app/components/base/button'

import './customStyle.css';
import cn from 'classnames'
import s from './index.module.css'

type IStepOneProps = {
  datasetId?: string,
  file?: File,
  updateFile: (file?: File) => void,
  onStepChange: () => void,
}

const dataSourceConfig = [
  { icon: 'https://assets.metaio.cc/assets/difyassets/ds-icons/ds-file.png', name: '本地文件', deascription: '已经整理好的文件', dataType: 'FILE' },
  { disabled: true, icon: 'https://assets.metaio.cc/assets/difyassets/ds-icons/ds-notion.png', name: 'Notion', deascription: '即将上线', dataType: 'COMMINGSOON' },
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
  onStepChange,
  file,
  updateFile,
}: IStepOneProps) => {
  const [dataSourceType, setDataSourceType] = useState('FILE')
  const [showModal, setShowModal] = useState(false)
  const { t } = useTranslation()

  const modalShowHandle = () => setShowModal(true)

  const modalCloseHandle = () => setShowModal(false)

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
          <FileUploader onFileUpdate={updateFile} file={file} />
          <Button background="#181A24" disabled={!file} borderRadius={1000} className={s.submitButton} type='primary' onClick={onStepChange}>{t('datasetCreation.stepOne.button')}</Button>
          {/* {!datasetId && (
            <>
              <div className={s.dividerLine} />
              <div onClick={modalShowHandle} className={s.OtherCreationOption}>{t('datasetCreation.stepOne.emptyDatasetCreation')}</div>
            </>
          )} */}
        </div>
        <EmptyDatasetCreationModal show={showModal} onHide={modalCloseHandle} />
      </div>
      {file && <FilePreview file={file} />}
    </div >
  )
}

export default StepOne
