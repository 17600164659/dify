import type { FC } from 'react'
import classNames from 'classnames'

import data from '@emoji-mart/data'
import { init } from 'emoji-mart'
import { roles } from '@/app/components/share/chat/constants';
import style from './style.module.css'

init({ data })

export type AppIconProps = {
  size?: 'tiny' | 'small' | 'medium' | 'large'
  rounded?: boolean
  icon?: string
  background?: string
  className?: string
  innerIcon?: React.ReactNode
  onClick?: () => void
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  icon,
  background,
  className,
  innerIcon,
  onClick,
  styles,
  width,
  height,
}) => {
  const appId = window.location.pathname.split('/')[2];
  let appIcon = '';
  roles.map(role => {
    if (role.id === appId) {
      appIcon = role.icon;
    }
  })

  return (
    <span
      className={classNames(
        style.appIcon,
        size !== 'medium' && style[size],
        rounded && style.rounded,
        className ?? '',
      )}
      // style={{
      //   background,
      // }}
      onClick={onClick}
      style={styles}
    >
      {/* {innerIcon ? innerIcon : icon && icon !== '' ? <em-emoji id={icon} /> : <em-emoji id='🤖' />} */}
      <img
        src={appIcon || "https://assets.metaio.cc/assets/difyassets/bisailogo.png"}
        style={{
          width: width || 88,
          height: height || 88,
          maxWidth: width || 88,
        }} />
    </span >
  )
}

export default AppIcon
