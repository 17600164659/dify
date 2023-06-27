'use client'
import React, { useEffect, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { IS_CE_EDITION } from '@/config'
import classNames from 'classnames'
import useSWR from 'swr'
import Link from 'next/link'
import style from './page.module.css'
// import Tooltip from '@/app/components/base/tooltip/index'
import Toast from '../components/base/toast'
import Button from '@/app/components/base/button'
import { login, oauth } from '@/service/common'
import { apiPrefix } from '@/config'
import { fetchMembers } from '@/service/common'
import request from '@/service/request';
import "./style.css";

const validEmailReg = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,}$/

type IState = {
  formValid: boolean
  github: boolean
  google: boolean
}

let members = {};

function reducer(state: IState, action: { type: string; payload: any }) {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        formValid: true,
      }
    case 'login_failed':
      return {
        ...state,
        formValid: true,
      }
    case 'github_login':
      return {
        ...state,
        github: true,
      }
    case 'github_login_failed':
      return {
        ...state,
        github: false,
      }
    case 'google_login':
      return {
        ...state,
        google: true,
      }
    case 'google_login_failed':
      return {
        ...state,
        google: false,
      }
    default:
      throw new Error('Unknown action.')
  }
}

const NormalForm = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [changePassword, setChangePassword] = useState(false);

  const getMenbers = async () => {
    const data = await request.post('/gpt', {
      type: 'getDifyUsers',
    })
    data.data.data.forEach(member => {
      members[member.Email] = member;
    })
  }

  const autoLogin = async () => {
    try {
      setIsLoading(true)
      await login({
        url: '/login',
        body: {
          email: 'nanwu5522@gmail.com',
          password: 'app000111',
          remember_me: true,
        },
      })
      router.push('/apps')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMenbers()
    autoLogin();
  }, [])

  const [state, dispatch] = useReducer(reducer, {
    formValid: false,
    github: false,
    google: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const [showOldPassword, setShowOldPassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('')

  const [changePasswordEmail, setChangePasswordEmail] = useState('')

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const handleEmailPasswordLogin = async () => {
    if (!validEmailReg.test(email)) {
      Toast.notify({
        type: 'error',
        message: t('login.error.emailInValid'),
      })
      return
    }
    let loginEmail = email;
    let loginPass = password;
    // LOG: 登录
    console.log(members, email, members[email], loginPass, 23232323)
    if (members[email] && members[email].password === loginPass) {
      loginEmail = "devin@metaio.cc";
      loginPass = "app000111";
      window.localStorage.setItem('logined_menber', email);
      if (email === 'devin@metaio.cc') {
        window.localStorage.setItem('is_owner', true);
      }
    }
    try {
      setIsLoading(true)
      await login({
        url: '/login',
        body: {
          email: loginEmail,
          password: loginPass,
          remember_me: true,
        },
      })
      router.push('/apps')
    } finally {
      setIsLoading(false)
    }
  }

  const changePasswordHandle = async () => {
    const data = await request.post('/gpt', {
      type: 'changeDifyUserPassword',
      email,
      oldPassword,
      newPassword,
    });
    if (data.data.code === 200 && data.data.msg === "success") {
      Toast.notify({ type: 'success', message: "密码修改成功!" })
      setChangePassword(false);
    } else {
      Toast.notify({ type: 'error', message: data.data.msg })
    }
  }

  const { data: github, error: github_error } = useSWR(state.github
    ? ({
      url: '/oauth/login/github',
      // params: {
      //   provider: 'github',
      // },
    })
    : null, oauth)

  const { data: google, error: google_error } = useSWR(state.google
    ? ({
      url: '/oauth/login/google',
      // params: {
      //   provider: 'google',
      // },
    })
    : null, oauth)

  useEffect(() => {
    if (github_error !== undefined)
      dispatch({ type: 'github_login_failed', payload: null })
    if (github)
      window.location.href = github.redirect_url
  }, [github, github_error])

  useEffect(() => {
    if (google_error !== undefined)
      dispatch({ type: 'google_login_failed', payload: null })
    if (google)
      window.location.href = google.redirect_url
  }, [google, google])

  return (
    <>
      <div className="w-full mx-auto">
        <h2 className="text-3xl font-normal text-gray-900">欢迎来到 AI金亮医生</h2>
        <div className='mt-2 text-sm text-gray-600 '>登录以继续</div>
      </div>

      <div className="w-full mx-auto mt-8">
        <div className="bg-white ">
          {/* {!IS_CE_EDITION && (
            <div className="flex flex-col gap-3 mt-6">
              <div className='w-full'>
                <a href={`${apiPrefix}/oauth/login/github`}>
                  <Button
                    type='default'
                    disabled={isLoading}
                    className='w-full'
                  >
                    <>
                      <span className={
                        classNames(
                          style.githubIcon,
                          'w-5 h-5 mr-2',
                        )
                      } />
                      <span className="truncate">{t('login.withGitHub')}</span>
                    </>
                  </Button>
                </a>
              </div>
              <div className='w-full'>
                <a href={`${apiPrefix}/oauth/login/google`}>
                  <Button
                    type='default'
                    disabled={isLoading}
                    className='w-full'
                  >
                    <>
                      <span className={
                        classNames(
                          style.googleIcon,
                          'w-5 h-5 mr-2',
                        )
                      } />
                      <span className="truncate">{t('login.withGoogle')}</span>
                    </>
                  </Button>
                </a>
              </div>
            </div>
          )} */}

          {
            // IS_CE_EDITION && <>
            true && <>

              {
                !changePassword ? (
                  <form className="space-y-6" onSubmit={() => { }}>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        {/* {t('login.email')} */}
                        邮箱
                      </label>
                      <div className="mt-1">
                        <input
                          style={{ height: 50, borderRadius: 2000 }}
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          id="email"
                          type="email"
                          autoComplete="email"
                          className={'appearance-none block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md shadow-sm placeholder-gray-400 sm:text-sm'}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="flex items-center justify-between text-sm font-medium text-gray-700">
                        {/* <span>{t('login.password')}</span> */}
                        <span>密码</span>
                        {/* <Tooltip
                      selector='forget-password'
                      htmlContent={
                        <div>
                          <div className='font-medium'>{t('login.forget')}</div>
                          <div className='font-medium text-gray-500'>
                            <code>
                              sudo rm -rf /
                            </code>
                          </div>
                        </div>
                      }
                    >
                      <span className='cursor-pointer text-primary-600'>{t('login.forget')}</span>
                    </Tooltip> */}
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          style={{ height: 50, borderRadius: 2000 }}
                          id="password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          className={`appearance-none block w-full px-3 py-2
                  border border-gray-300
                  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                  rounded-md shadow-sm placeholder-gray-400 sm:text-sm pr-10`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                          >
                            {showPassword ? '👀' : '😝'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className='submit-btns-container'>
                      <Button
                        width={150}
                        borderRadius={1000}
                        type='primary'
                        background="#181A24"
                        onClick={handleEmailPasswordLogin}
                        disabled={isLoading}
                      // >{t('login.signBtn')}</Button>
                      >登录</Button>
                      <div className='change-password-btn' onClick={() => setChangePassword(true)}>
                        修改密码
                      </div>
                    </div>
                  </form>
                ) : (
                  <form className="space-y-6" onSubmit={() => { }}>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        邮箱
                      </label>
                      <div className="mt-1">
                        <input
                          style={{ height: 50, borderRadius: 2000 }}
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          id="email"
                          type="email"
                          autoComplete="email"
                          className={'appearance-none block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md shadow-sm placeholder-gray-400 sm:text-sm'}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="flex items-center justify-between text-sm font-medium text-gray-700">
                        <span>旧密码</span>
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          style={{ height: 50, borderRadius: 2000 }}
                          id="password"
                          value={oldPassword}
                          onChange={e => setOldPassword(e.target.value)}
                          type={showOldPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          className={`appearance-none block w-full px-3 py-2
                  border border-gray-300
                  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                  rounded-md shadow-sm placeholder-gray-400 sm:text-sm pr-10`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                          >
                            {showOldPassword ? '👀' : '😝'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="flex items-center justify-between text-sm font-medium text-gray-700">
                        <span>新密码</span>
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          style={{ height: 50, borderRadius: 2000 }}
                          id="password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          type={showNewPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          className={`appearance-none block w-full px-3 py-2
                  border border-gray-300
                  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                  rounded-md shadow-sm placeholder-gray-400 sm:text-sm pr-10`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                          >
                            {showNewPassword ? '👀' : '😝'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="flex items-center justify-between text-sm font-medium text-gray-700">
                        <span>确认新密码</span>
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          style={{ height: 50, borderRadius: 2000 }}
                          id="password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          className={`appearance-none block w-full px-3 py-2
                  border border-gray-300
                  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                  rounded-md shadow-sm placeholder-gray-400 sm:text-sm pr-10`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                          >
                            {showConfirmPassword ? '👀' : '😝'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className='submit-btns-container'>
                      <Button
                        width={150}
                        borderRadius={1000}
                        type='primary'
                        background="#181A24"
                        onClick={() => changePasswordHandle()}
                        disabled={isLoading}
                      >确定</Button>
                      <Button
                        styles={{ marginLeft: 20 }}
                        width={150}
                        borderRadius={1000}
                        type='primary'
                        background="#181A24"
                        onClick={() => setChangePassword(false)}
                        disabled={isLoading}
                      >取消</Button>
                    </div>
                  </form>
                )
              }
            </>
          }
          {/*  agree to our Terms and Privacy Policy. */}
          {/* <div className="block mt-6 text-xs text-gray-600">
            {t('login.tosDesc')}
            &nbsp;
            <Link
              className='text-primary-600'
              target={'_blank'}
              href='https://ipollo.ai/user-agreement/terms-of-service'
            >{t('login.tos')}</Link>
            &nbsp;&&nbsp;
            <Link
              className='text-primary-600'
              target={'_blank'}
              href='https://ipollo.ai/user-agreement/privacy-policy'
            >{t('login.pp')}</Link>
          </div> */}

        </div>
      </div>
    </>
  )
}

export default NormalForm
