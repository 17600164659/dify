import React from 'react'
import type { FC } from 'react'
import NavLink from './navLink'
import AppBasic from './basic'

export type IAppDetailNavProps = {
  iconType?: 'app' | 'dataset'
  title: string
  desc: string
  icon: string
  icon_background: string
  navigation: Array<{
    name: string
    href: string
    icon: any
    selectedIcon: any
  }>
  extraInfo?: React.ReactNode
}


const AppDetailNav: FC<IAppDetailNavProps> = ({ title, desc, icon, icon_background, navigation, extraInfo, iconType = 'app' }) => {
  return (
    <div className="flex flex-col w-56 overflow-y-auto bg-white border-r border-gray-200 shrink-0" style={{ zIndex: 9, boxShadow: "4px 0px 32px rgba(77, 90, 115, 0.08)" }}>
      <div className="flex flex-shrink-0 p-4" style={{ position: 'relative', left: 10 }}>
        <AppBasic noHeader={true} name={title} type={desc} styles={{
          // padding: '2px 12px',
          paddingTop: 2,
          marginTop: 5,
          color: "#5A6478",
          // background: '#181A24',
          boxShadow: "10px 10px 81px rgba(77, 90, 115, 0.08)",
          borderRadius: 8,
        }} />
      </div>
      <nav className="flex-1 p-4 space-y-1 bg-white">
        {navigation.map((item, index) => {
          return (
            <NavLink key={index} iconMap={{ selected: item.selectedIcon, normal: item.icon }} name={item.name} href={item.href} />
          )
        })}
        {extraInfo ?? null}
      </nav>
    </div>
  )
}

export default React.memo(AppDetailNav)
