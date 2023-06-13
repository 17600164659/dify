'use client'

import { useContext, useContextSelector } from 'use-context-selector'
import Link from 'next/link'
import type { MouseEventHandler } from 'react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import style from '../list.module.css'
import AppModeLabel from './AppModeLabel'
import type { App } from '@/types/app'
import Confirm from '@/app/components/base/confirm'
import { ToastContext } from '@/app/components/base/toast'
import { deleteApp } from '@/service/apps'
import AppIcon from '@/app/components/base/app-icon'
import AppsContext from '@/context/app-context'
import './appCardCustom.css';

export type AppCardProps = {
  app: App
  onDelete?: () => void
}

const AppCard = ({
  app,
  onDelete
}: AppCardProps) => {
  const { t } = useTranslation()
  const { notify } = useContext(ToastContext)

  const mutateApps = useContextSelector(AppsContext, state => state.mutateApps)

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const onDeleteClick: MouseEventHandler = useCallback((e) => {
    e.preventDefault()
    setShowConfirmDelete(true)
  }, [])
  const onConfirmDelete = useCallback(async () => {
    try {
      await deleteApp(app.id)
      notify({ type: 'success', message: t('app.appDeleted') })
      if (onDelete)
        onDelete()
      mutateApps()
    }
    catch (e: any) {
      notify({ type: 'error', message: `${t('app.appDeleteFailed')}${'message' in e ? `: ${e.message}` : ''}` })
    }
    setShowConfirmDelete(false)
  }, [app.id])

  return (
    <>
      <Link href={`/app/${app.id}/overview`} className={style.listItem} style={{ width: 400, height: 297, position: 'relative', overflow: 'hidden' }}>
        <div className='app-card-list-item-decoration'></div>
        <div
          className={style.listItemTitle}
          style={{
            height: 88,
            padding: 0,
            marginLeft: 32,
            marginTop: 44,
          }}>
          <AppIcon
            size='large'
            icon={app.icon}
            background={app.icon_background}
            styles={{
              height: 88,
              width: 88,
            }}
          />
          <div className={style.listItemHeading} style={{ height: 'auto' }}>
            <div className='app-name-text'>{app.name}</div>
            <div><span className='app-gray-text'>应用类型:</span> 对话型应用</div>
            <div><span className='app-gray-text'>创建时间:</span> 2023.05.20</div>
          </div>
          {/* <span className={style.deleteAppIcon} onClick={onDeleteClick} style={{ backgroundImage: "url('https://assets.metaio.cc/assets/difyassets/delete.png')" }} /> */}
        </div>
        <div className={style.listItemDescription} style={{
          marginTop: 20,
          height: 100,
          color: "#19243B",
          overflow: 'hidden',
          padding: '0 24px',
          fontSize: 16,
          fontFamily: 'PingFang SC',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: 16,
        }}>{app.model_config?.pre_prompt}</div>
        <div onClick={onDeleteClick} className={style.deleteAppIcon + ' app-card-list-item-delete'}>
          <img src="https://assets.metaio.cc/assets/difyassets/newdelete.png" className='app-card-list-item-delete-icon' />
          删除
        </div>
        {/* <div className='app-card-list-item-line'></div> */}
        {/* <div className={style.listItemFooter}>
          <AppModeLabel mode={app.mode} />
        </div> */}
        {/* <div className='mode-type-container'>
          <img src="https://assets.metaio.cc/assets/difyassets/dh.png" />
          对话型应用
        </div> */}

        {showConfirmDelete && (
          <Confirm
            title={t('app.deleteAppConfirmTitle')}
            content={t('app.deleteAppConfirmContent')}
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

export default AppCard
