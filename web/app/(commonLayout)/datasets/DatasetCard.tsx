'use client'

import { useContext } from 'use-context-selector'
import Link from 'next/link'
import type { MouseEventHandler } from 'react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import style from '../list.module.css'
import Confirm from '@/app/components/base/confirm'
import { ToastContext } from '@/app/components/base/toast'
import { deleteDataset } from '@/service/datasets'
import AppIcon from '@/app/components/base/app-icon'
import AppsContext from '@/context/app-context'
import { DataSet } from '@/models/datasets'
import classNames from 'classnames'
import '../apps/appCardCustom.css';

export type DatasetCardProps = {
  dataset: DataSet
  onDelete?: () => void
}

const DatasetCard = ({
  dataset,
  onDelete,
}: DatasetCardProps) => {
  const { t } = useTranslation()
  const { notify } = useContext(ToastContext)

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const onDeleteClick: MouseEventHandler = useCallback((e) => {
    e.preventDefault()
    setShowConfirmDelete(true)
  }, [])
  const onConfirmDelete = useCallback(async () => {
    try {
      await deleteDataset(dataset.id)
      notify({ type: 'success', message: t('dataset.datasetDeleted') })
      if (onDelete)
        onDelete()
    }
    catch (e: any) {
      notify({ type: 'error', message: `${t('dataset.datasetDeleteFailed')}${'message' in e ? `: ${e.message}` : ''}` })
    }
    setShowConfirmDelete(false)
  }, [dataset.id])

  return (
    <>
      <Link href={`/datasets/${dataset.id}/documents`} className={style.listItem} style={{ width: "100%", height: 297, position: 'relative', overflow: 'hidden' }}>
        <div className='app-card-list-item-decoration'></div>
        <div className={style.listItemTitle} style={{
          height: 88,
          padding: 0,
          marginLeft: 32,
          marginTop: 22,
          marginBottom: 44
        }}>
          {/* <AppIcon size='small' /> */}
          <div className={style.listItemHeading}>
            {/* <div className={style.listItemHeadingContent}>{dataset.name}</div> */}
            <div className={style.listItemHeading} style={{ height: 'auto' }}>
              <div className='app-name-text'>{dataset.name}</div>
              <div>
                <span className='dataset-info-title'>{t('dataset.documentCount')}:</span>
                <span className='dataset-info-num'>{dataset.document_count}</span>

                <span className='dataset-info-title'>{t('dataset.wordCount')}:</span>
                <span className='dataset-info-num'>{Math.round(dataset.word_count / 1000)}</span>

                <span className='dataset-info-title'>{t('dataset.appCount')}:</span>
                <span className='dataset-info-num'>{dataset.app_count}</span>
              </div>
            </div>
          </div>
          {/* <span className={style.deleteAppIcon} onClick={onDeleteClick} /> */}
        </div>
        {/* <div className={classNames(style.listItemFooter, style.datasetCardFooter)} style={{ marginBottom: 8 }}>
          <span className={style.listItemStats}>
            <span className={classNames(style.listItemFooterIcon, style.docIcon)} />
            {dataset.document_count}{t('dataset.documentCount')}
          </span>
          <span className={style.listItemStats}>
            <span className={classNames(style.listItemFooterIcon, style.textIcon)} />
            {Math.round(dataset.word_count / 1000)}{t('dataset.wordCount')}
          </span>
          <span className={style.listItemStats}>
            <span className={classNames(style.listItemFooterIcon, style.applicationIcon)} />
            {dataset.app_count}{t('dataset.appCount')}
          </span>
        </div> */}
        <div className={style.listItemDescription} style={{ overflow: 'initial', padding: '0 34px', fontFamily: 'PingFang SC', fontStyle: 'normal', fontWeight: 400, fontSize: 16, color: '#19243B' }}>{dataset.description}</div>
        <div onClick={onDeleteClick} className={style.deleteAppIcon + ' app-card-list-item-delete'}>
          <img src="https://assets.metaio.cc/assets/difyassets/newdelete.png" className='app-card-list-item-delete-icon' />
          删除
        </div>
        {showConfirmDelete && (
          <Confirm
            title={t('dataset.deleteDatasetConfirmTitle')}
            content={t('dataset.deleteDatasetConfirmContent')}
            isShow={showConfirmDelete}
            onClose={() => setShowConfirmDelete(false)}
            onConfirm={onConfirmDelete}
            onCancel={() => setShowConfirmDelete(false)}
          />
        )}
      </Link>
    </>
  )
}

export default DatasetCard
