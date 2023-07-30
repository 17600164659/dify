'use client'
import type { FC } from 'react'
import React, { useEffect } from 'react'
import cn from 'classnames'
import useSWR from 'swr'
import { useTranslation } from 'react-i18next'
import {
  ChartBarSquareIcon,
  Cog8ToothIcon,
  CommandLineIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import {
  ChartBarSquareIcon as ChartBarSquareSolidIcon,
  Cog8ToothIcon as Cog8ToothSolidIcon,
  CommandLineIcon as CommandLineSolidIcon,
  DocumentTextIcon as DocumentTextSolidIcon,
} from '@heroicons/react/24/solid'
import s from './style.module.css'
import AppSideBar from '@/app/components/app-sidebar'
import BasicSideBar from '@/app/components/basic-sidebar'
import { fetchAppDetail } from '@/service/apps'

export type IAppDetailLayoutProps = {
  children: React.ReactNode
  params: { appId: string }
}

const AppDetailLayout: FC<IAppDetailLayoutProps> = (props) => {
  const {
    children,
    params: { appId }, // get appId in path
  } = props
  const { t } = useTranslation()
  const detailParams = { url: '/apps', id: appId }
  const { data: response } = useSWR(detailParams, fetchAppDetail)

  const navigation = [
    { name: '浏览', href: `/app/${appId}/overview`, icon: <img width={24} height={24} src="https://assets.metaio.cc/assets/difyassets/ll.png" />, selectedIcon: <img width={24} height={24} src="https://assets.metaio.cc/assets/difyassets/ll.png" /> },
    { name: '微调训练', href: `/app/${appId}/configuration`, icon: <img width={24} height={24} src="https://assets.metaio.cc/assets/difyassets/wtxl.png" />, selectedIcon: <img width={24} height={24} src="https://assets.metaio.cc/assets/difyassets/wtxl.png" /> },
    { name: '日志标记', href: `/app/${appId}/logs`, icon: <img width={24} height={24} src="https://assets.metaio.cc/assets/difyassets/rzbj.png" />, selectedIcon: <img width={24} height={24} src="https://assets.metaio.cc/assets/difyassets/rzbj.png" /> },
    { name: '用户', href: `/app/${appId}/userlist`, icon: <img width={24} height={24} src="https://assets.metaio.cc/assets/difyassets/rzbj.png" />, selectedIcon: <img width={24} height={24} src="https://assets.metaio.cc/assets/difyassets/rzbj.png" /> },
    { name: '文章', href: `/app/${appId}/article`, icon: <img width={24} height={24} src="https://assets.metaio.cc/assets/difyassets/rzbj.png" />, selectedIcon: <img width={24} height={24} src="https://assets.metaio.cc/assets/difyassets/rzbj.png" /> },
  ]
  // const navigation = [
  //   { name: t('common.appMenus.overview'), href: `/app/${appId}/overview`, icon: ChartBarSquareIcon, selectedIcon: ChartBarSquareSolidIcon },
  //   { name: t('common.appMenus.promptEng'), href: `/app/${appId}/configuration`, icon: Cog8ToothIcon, selectedIcon: Cog8ToothSolidIcon },
  //   { name: t('common.appMenus.apiAccess'), href: `/app/${appId}/develop`, icon: CommandLineIcon, selectedIcon: CommandLineSolidIcon },
  //   { name: t('common.appMenus.logAndAnn'), href: `/app/${appId}/logs`, icon: DocumentTextIcon, selectedIcon: DocumentTextSolidIcon },
  // ]
  const appModeName = response?.mode?.toUpperCase() === 'COMPLETION' ? t('common.appModes.completionApp') : t('common.appModes.chatApp')
  useEffect(() => {
    if (response?.name)
      document.title = `${(response.name || 'App')} - 沃比医疗`
  }, [response])
  if (!response)
    return null
  return (
    <div className={cn(s.app, 'flex', 'overflow-hidden')}>
      <BasicSideBar title={"未陌AI"} desc={appModeName} layout="apps" />
      <AppSideBar title={response.name} desc={appModeName} navigation={navigation} />
      <div className="bg-white grow" style={{ background: '#ebeef4' }}>{children}</div>
    </div>
  )
}
export default React.memo(AppDetailLayout)
