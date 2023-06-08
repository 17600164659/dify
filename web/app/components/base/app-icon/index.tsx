import type { FC } from 'react'
import classNames from 'classnames'
import style from './style.module.css'

import data from '@emoji-mart/data'
import { init } from 'emoji-mart'

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
      <img src="https://assets.metaio.cc/assets/difyassets/logo.png" style={{ width: width || 33, height: height || 33 }} />
    </span>
  )
}

export default AppIcon
