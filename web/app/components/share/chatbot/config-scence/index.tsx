import type { FC } from 'react'
import React from 'react'
import type { IWelcomeProps } from '../welcome'
import Welcome from '../welcome'

const ConfigScene: FC<IWelcomeProps> = (props) => {
  return null;
  // return (
  //   <div className='mb-5 antialiased font-sans shrink-0'>
  //     <Welcome {...props} />
  //   </div>
  // )
}
export default React.memo(ConfigScene)
