import type { FC, MouseEventHandler } from 'react'
import React from 'react'
import Spinner from '../spinner'

export type IButtonProps = {
  type?: string
  className?: string
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Button: FC<IButtonProps> = ({
  type,
  disabled,
  children,
  className,
  onClick,
  loading = false,
  color,
  background,
  border,
  borderRadius,
  width,
  styles,
}) => {
  let style = 'cursor-pointer'
  switch (type) {
    case 'primary':
      style = (disabled || loading) ? 'bg-primary-200 cursor-not-allowed text-white' : 'bg-primary-600 hover:bg-primary-600/75 hover:shadow-md cursor-pointer text-white hover:shadow-sm'
      break
    case 'warning':
      style = (disabled || loading) ? 'bg-red-600/75 cursor-not-allowed text-white' : 'bg-red-600 hover:bg-red-600/75 hover:shadow-md cursor-pointer text-white hover:shadow-sm'
      break
    case 'nohover':
      style = 'border-solid border border-gray-200 cursor-pointer text-gray-500'
      break
    default:
      style = disabled ? 'border-solid border border-gray-200 bg-gray-200 cursor-not-allowed text-gray-800' : 'border-solid border border-gray-200 cursor-pointer text-gray-500 hover:bg-white hover:shadow-sm hover:border-gray-300'
      break
  }

  const custom_styles = { ...styles };
  if (color) custom_styles.color = color;
  if (background) custom_styles.background = disabled ? background + '81' : background;
  if (border) custom_styles.border = border;
  if (borderRadius) custom_styles.borderRadius = borderRadius;
  if (width) custom_styles.width = width;

  return (
    <div
      style={custom_styles}
      className={`inline-flex justify-center items-center content-center h-9 leading-5 rounded-lg px-4 py-2 text-base ${style} ${className && className}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
      {/* Spinner is hidden when loading is false */}
      <Spinner loading={loading} className='!text-white !h-3 !w-3 !border-2 !ml-1' />
    </div>
  )
}

export default React.memo(Button)
