import React from 'react'
import cn from 'classnames'
import Forms from './forms'
import Header from './_header'
import style from './page.module.css'

const SignIn = () => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        className={cn(
          style.background,
          'flex w-full min-h-screen',
          'sm:p-4 lg:p-8',
          'gap-x-20',
          'justify-center lg:justify-start'
        )}>
        <div style={{
          width: 1254,
          height: 774,
          margin: "0 auto",
          background: '#FFFFFF',
          boxShadow: '0px 24px 32px rgba(90, 100, 120, 0.1)',
          borderRadius: 16,
        }} className={
          cn(
            'flex w-full flex-col bg-white shadow rounded-2xl shrink-0',
            'space-between',
          )
        }>
          {/* <Header /> */}
          <Forms />
          <div style={{ textAlign: 'right' }} className='px-8 py-6 text-sm font-normal text-gray-500'>
            <span style={{ float: 'left' }}>V1.1.0</span>© {new Date().getFullYear()} 卒息常谈, Inc. All rights reserved.
          </div>
        </div>

      </div>

    </>
  )
}

export default SignIn
