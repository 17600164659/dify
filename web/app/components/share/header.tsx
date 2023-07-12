import type { FC } from 'react'
import React from 'react'
import AppIcon from '@/app/components/base/app-icon'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'
export type IHeaderProps = {
  title: string
  icon: string
  icon_background: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}

const newBgStyle = {
  background: "url(https://assets.metaio.cc/assets/difyassets/header-bg.png) 100% 100%",
};

const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  icon,
  icon_background,
  onShowSideBar,
  onCreateNewChat,
}) => {
  return (
    <div className="shrink-0 flex items-center justify-between h-12 px-3 bg-gray-100" style={newBgStyle}>
      {isMobile ? (
        <div
          className='flex items-center justify-center h-8 w-8 cursor-pointer'
          onClick={() => onShowSideBar?.()}
        >
          {/* <Bars3Icon className="h-4 w-4 text-gray-500" /> */}
          <img src="https://assets.metaio.cc/assets/difyassets/back.png" style={{ width: 20, height: 20 }} />
        </div>
      ) : <div></div>}
      <div className='flex items-center space-x-2'>
        <AppIcon size="small" icon={icon} background={icon_background} width={30} height={30} />
        <div className=" text-sm text-gray-800 font-bold">MetaIO</div>
      </div>
      {isMobile ? (
        <div className='flex items-center justify-center h-8 w-8 cursor-pointer'
          onClick={() => onCreateNewChat?.()}
        >
          {/* <PencilSquareIcon className="h-4 w-4 text-gray-500" /> */}
          <img src="https://assets.metaio.cc/assets/difyassets/newchat.png" style={{ width: 20, height: 20 }} />
        </div>) : <div></div>}
    </div>
  )
}

export default React.memo(Header)
