import React from 'react'
import type { FC } from 'react'
import Link from 'next/link'
import { WorkspaceProvider } from '@/context/workspace-context'
import { useDatasetsContext } from '@/context/datasets-context'
import AccountDropdown from '@/app/components/header/account-dropdown'
import NavLink from './navLink'
import AppBasic from './basic'
import { fetchAppDetail } from '@/service/apps';
import "./style.css";

export type IAppDetailNavProps = {
  iconType?: 'app' | 'dataset'
  title: string
  desc: string
  navigation: Array<{
    name: string
    href: string
    icon: any
    selectedIcon: any
  }>
  extraInfo?: React.ReactNode
}

const sampleAppIconUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
const databaseUrl = 'https://assets.metaio.cc/assets/difyassets/database.png';
const appUrl = 'https://assets.metaio.cc/assets/difyassets/app.png';
const logoUrl = 'https://assets.metaio.cc/assets/difyassets/logo.png';

const AppDetailNav: FC<IAppDetailNavProps> = ({
  title,
  desc,
  navigation,
  extraInfo,
  iconType = 'app',
  isChat,
  apps,
}) => {
  let userProfile;
  let onLogout;
  let langeniusVersionInfo;
  if (!isChat) {
    userProfile = window.APP.userProfile;
    onLogout = window.APP.onLogout;
    langeniusVersionInfo = window.APP.langeniusVersionInfo;
  }

  const getAppInfoAndGo = async (appInfo) => {
    const data = await fetchAppDetail({ url: '/apps', id: appInfo.id });
    console.log(data);
    window.location.href = `${window.location.origin}/chat/${data.site.access_token}`;
  }

  return (
    <div className="flex flex-col w-17 overflow-y-auto bg-white border-r border-gray-200 shrink-0">
      <img src={logoUrl} className='basic-sidebar-header' />
      {
        !isChat ? (
          <div className='basic-sidebar-menu'>
            <Link href="/apps">
              <div class="basic-sidebar-menu-item">
                <img className='basic-sidebar-menu-icon' src={appUrl} />
              </div>
            </Link>
            <Link href="/datasets">
              <div class="basic-sidebar-menu-item">
                <img className='basic-sidebar-menu-icon' src={databaseUrl} />
              </div>
            </Link>
          </div>
        ) : apps && apps.length ? (
          <div className='basic-sidebar-menu'>
            {apps.map(appInfo => (
              <div style={{ cursor: "pointer" }} onClick={() => getAppInfoAndGo(appInfo)}>
                <div class="basic-sidebar-menu-item active">
                  {
                    appInfo.icon ? <img className='basic-sidebar-menu-icon' src={appInfo.icon} /> : appInfo.name.substr(0, 1)
                  }
                </div>
                <div style={{ textAlign: "center" }} className='basic-sidebar-menu-item-title'>
                  {appInfo.name}
                </div>
              </div>
            ))}
          </div>
        ) : null
      }

      {
        !isChat ? (
          <WorkspaceProvider>
            <AccountDropdown userProfile={userProfile} onLogout={onLogout} langeniusVersionInfo={langeniusVersionInfo} />
          </WorkspaceProvider>
        ) : null
      }
    </div>
  )
}

export default React.memo(AppDetailNav)
