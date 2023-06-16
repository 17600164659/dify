'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import useSWR, { useSWRConfig } from 'swr'
import AppCard from '@/app/components/app/overview/appCard'
import Loading from '@/app/components/base/loading'
import { ToastContext } from '@/app/components/base/toast'
import { fetchAppDetail, updateAppApiStatus, updateAppSiteAccessToken, updateAppSiteConfig, updateAppSiteStatus } from '@/service/apps'
import type { IToastProps } from '@/app/components/base/toast'
import type { App } from '@/types/app'
import "./style.css";

export type ICardViewProps = {
  appId: string
}

type IParams = {
  url: string
  body?: Record<string, any>
}

export async function asyncRunSafe<T>(func: (val: IParams) => Promise<T>, params: IParams, callback: (props: IToastProps) => void, dict?: any): Promise<[string?, T?]> {
  try {
    const res = await func(params)
    callback && callback({ type: 'success', message: dict('common.actionMsg.modifiedSuccessfully') })
    return [undefined, res]
  }
  catch (err) {
    callback && callback({ type: 'error', message: dict('common.actionMsg.modificationFailed') })
    return [(err as Error).message, undefined]
  }
}

const CardView: FC<ICardViewProps> = ({ appId }) => {
  const detailParams = { url: '/apps', id: appId }
  const { data: response } = useSWR(detailParams, fetchAppDetail)
  const { mutate } = useSWRConfig()
  const { notify } = useContext(ToastContext)
  const { t } = useTranslation()

  if (!response)
    return <Loading />

  const onChangeSiteStatus = async (value: boolean) => {
    const [err] = await asyncRunSafe<App>(updateAppSiteStatus as any, { url: `/apps/${appId}/site-enable`, body: { enable_site: value } }, notify, t)
    if (!err)
      mutate(detailParams)
  }

  const onChangeApiStatus = async (value: boolean) => {
    const [err] = await asyncRunSafe<App>(updateAppApiStatus as any, { url: `/apps/${appId}/api-enable`, body: { enable_api: value } }, notify, t)
    if (!err)
      mutate(detailParams)
  }

  const onSaveSiteConfig = async (params: any) => {
    const [err] = await asyncRunSafe<App>(updateAppSiteConfig as any, { url: `/apps/${appId}/site`, body: params }, notify, t)
    if (!err)
      mutate(detailParams)
  }

  const onGenerateCode = async () => {
    const [err] = await asyncRunSafe<App>(updateAppSiteAccessToken as any, { url: `/apps/${appId}/site/access-token-reset` }, notify, t)
    if (!err)
      mutate(detailParams)
  }

  return (
    <div className='flex flex-row justify-between w-full mb-6'>
      <AppCard
        styles={{ flex: 0.5 }}
        className='mr-3 flex-1'
        appInfo={response}
        onChangeStatus={onChangeSiteStatus}
        onGenerateCode={onGenerateCode}
        onSaveSiteConfig={onSaveSiteConfig} />
      <div className='overview-4-card'>
        <div className='card-line' style={{ marginBottom: 12 }}>
          <div style={{ marginRight: 12 }} className='card-item'>
            <div style={{ background: '#e6eefc' }} className="card-icon-bg">
              <img src="https://assets.metaio.cc/assets/difyassets/xzyh.png" className='card-icon-img' />
            </div>
            <div>
              <p className='card-num'>999</p>
              <p className='card-title'>今日新增用户数</p>
            </div>
          </div>
          <div className='card-item'>
            <div style={{ background: '#e1e3f5' }} className="card-icon-bg">
              <img src="https://assets.metaio.cc/assets/difyassets/ljyh.png" className='card-icon-img' />
            </div>
            <div>
              <p className='card-num'>999</p>
              <p className='card-title'>累计用户数</p>
            </div>
          </div>
        </div>
        <div className='card-line'>
          <div style={{ marginRight: 12 }} className='card-item'>
            <div style={{ background: '#faf0ec' }} className="card-icon-bg">
              <img src="https://assets.metaio.cc/assets/difyassets/xzht.png" className='card-icon-img' />
            </div>
            <div>
              <p className='card-num'>999</p>
              <p className='card-title'>今日新增话题数</p>
            </div>
          </div>
          <div className='card-item'>
            <div style={{ background: '#ebf6ef' }} className="card-icon-bg">
              <img src="https://assets.metaio.cc/assets/difyassets/ljht.png" className='card-icon-img' />
            </div>
            <div>
              <p className='card-num'>999</p>
              <p className='card-title'>累计话题数</p>
            </div>
          </div>
        </div>
      </div>
      {
        window.location.search.indexOf('qc_xuyao_api_status') && (
          <AppCard
            className='ml-3 flex-1'
            cardType='api'
            appInfo={response}
            onChangeStatus={onChangeApiStatus} />
        )
      }
      {/* <AppCard
        className='ml-3 flex-1'
        cardType='api'
        appInfo={response}
        onChangeStatus={onChangeApiStatus} /> */}
    </div>
  )
}

export default CardView
