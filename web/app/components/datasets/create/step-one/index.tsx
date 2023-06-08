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
        <div className={s.stepHeader}>{t('datasetCreation.steps.one')}</div>
        <div className={s.form}>
          <div className={s.dataSourceTypeList}>
            <div
              className={cn(s.dataSourceItem, dataSourceType === 'FILE' && s.active) + ' data-source-item'}
              onClick={() => setDataSourceType('FILE')}
              style={dataSourceType === 'FILE' ? { borderColor: "#181A24", color: "#181A24" } : {}}
            >
              {/* <span className={cn(s.datasetIcon)} /> */}
              <img className='data-source-item-icon' src="https://assets.metaio.cc/assets/difyassets/file.png" />
              <div className='data-source-item-info'>
                <div className='data-source-item-title'>{t('datasetCreation.stepOne.dataSourceType.file')}</div>
                <div className='data-source-item-discription'>标注</div>
              </div>
            </div>
            <div
              className={cn(s.dataSourceItem, s.disabled, dataSourceType === 'notion' && s.active) + ' data-source-item'}
            // onClick={() => setDataSourceType('notion')}
            >
              <span className={s.comingTag}>Coming soon</span>
              {/* <span className={cn(s.datasetIcon, s.notion)} /> */}
              <img className='data-source-item-icon' src="https://assets.metaio.cc/assets/difyassets/notion.png" />
              <div className='data-source-item-info'>
                <div className='data-source-item-title'>{t('datasetCreation.stepOne.dataSourceType.notion')}</div>
                <div className='data-source-item-discription'>标注</div>
              </div>
            </div>
            <div
              className={cn(s.dataSourceItem, s.disabled, dataSourceType === 'web' && s.active) + ' data-source-item'}
            // onClick={() => setDataSourceType('web')}
            >
              <span className={s.comingTag}>Coming soon</span>
              {/* <span className={cn(s.datasetIcon, s.web)} /> */}
              <img className='data-source-item-icon' src="https://assets.metaio.cc/assets/difyassets/web.png" />
              <div className='data-source-item-info'>
                <div className='data-source-item-title'>{t('datasetCreation.stepOne.dataSourceType.web')}</div>
                <div className='data-source-item-discription'>标注</div>
              </div>
            </div>
            <div
              className={cn(s.dataSourceItem, s.disabled, dataSourceType === 'web' && s.active) + ' data-source-item'}
              onClick={modalShowHandle}
              style={{ cursor: "pointer" }}
            >
              {/* <span className={cn(s.datasetIcon, s.web)} /> */}
              <img className='data-source-item-icon' src="https://assets.metaio.cc/assets/difyassets/add.png" />
              <div className='data-source-item-info'>
                <div className='data-source-item-title'>{t('datasetCreation.stepOne.emptyDatasetCreation')}</div>
                <div className='data-source-item-discription'>标注</div>
              </div>
            </div>
          </div>
          <FileUploader onFileUpdate={updateFile} file={file} />
          <Button background="#181A24" disabled={!file} background="#181A24" className={s.submitButton} type='primary' onClick={onStepChange}>{t('datasetCreation.stepOne.button')}</Button>
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
