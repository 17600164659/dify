'use client'

import { useEffect, useRef, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import { debounce, size } from 'lodash-es'
import AppCard from './AppCard'
import NewAppCard from './NewAppCard'
import type { AppListResponse } from '@/models/app'
import { fetchAppList } from '@/service/apps'
import { useSelector } from '@/context/app-context'
import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
import { useTranslation } from 'react-i18next'
import BasicSidebar from "@/app/components/basic-sidebar";
import OverView from "@/app/components/overview/overview"
import NewAppDialog from './NewAppDialog';
import request from '@/service/request';

const getKey = (pageIndex: number, previousPageData: AppListResponse) => {
  if (!pageIndex || previousPageData.has_more) {
    const newPage = pageIndex + 1;
    return { url: 'apps', params: { page: newPage, limit: 30 } }
  }
  return null
}

const customStyle = {
  display: 'flex',
  height: "100vh",
}

const Apps = () => {
  const { t } = useTranslation()
  const { data, isLoading, setSize, mutate } = useSWRInfinite(getKey, fetchAppList, { revalidateFirstPage: false })
  const [renderList, setRenderList] = useState([]);
  const [myApps, setMyApps] = useState([]);
  async function getApps() {
    const userId = window.localStorage.getItem('logined_menber');
    if (!userId) return;
    const selfAppList = await request.post('/gpt', {
      type: 'getDifyApps',
      userId
    });
    console.log(selfAppList, 23232323)
    const list = selfAppList.data.data.map(item => item.AppId)
    setMyApps(list);
  }
  const loadingStateRef = useRef(false)
  const pageContainerRef = useSelector(state => state.pageContainerRef)
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const [showNewAppDialog, setShowNewAppDialog] = useState(false)

  useEffect(() => {
    document.title = `${t('app.title')} -  wemoai.com`;
    if (localStorage.getItem(NEED_REFRESH_APP_LIST_KEY) === '1') {
      localStorage.removeItem(NEED_REFRESH_APP_LIST_KEY)
      mutate()
    }
    getApps();
  }, [])

  useEffect(() => {
    loadingStateRef.current = isLoading
  }, [isLoading])

  useEffect(() => {

    const container = document.querySelector('#apps-container');
    const parentContainer = document.querySelector('#apps-parent-container');
    const onScroll = debounce(() => {
      // console.log(loadingStateRef, anchorRef, 23232323)
      if (!loadingStateRef.current) {
        const { scrollTop, clientHeight } = container;// pageContainerRef?.current!
        const anchorOffset = parentContainer.offsetTop// anchorRef.current!.offsetTop
        if (anchorOffset - scrollTop - clientHeight < 100) {
          setSize(size => size + 1)
        }
      }
    }, 50)

    // const onScroll = debounce(() => {
    //   if (!loadingStateRef.current) {
    //     const { scrollTop, clientHeight } = pageContainerRef?.current!
    //     const anchorOffset = anchorRef.current!.offsetTop
    //     if (anchorOffset - scrollTop - clientHeight < 100)
    //       setSize(size => size + 1)
    //   }
    // }, 50)

    container.addEventListener('scroll', onScroll)
    // getDatasets();
    return () => container.removeEventListener('scroll', onScroll)

    // pageContainerRef?.current?.addEventListener('scroll', onScroll)
    // return () => pageContainerRef?.current?.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const newApps = []
    if (data) {
      const loadStatusApps = [...myApps];
      const is_owner = window.localStorage.getItem('is_owner')
      for (let i = 0; i < data?.length; i++) {
        const current = data[i];
        if (current.data?.length) {
          current.data.map(item => {
            const myAppsIndex = loadStatusApps.indexOf(item.id);
            if (myAppsIndex > -1 || is_owner) {
              newApps.push(item);
              loadStatusApps.splice(myAppsIndex, 1)
            }
          })
        }
      }
      if (is_owner) {
        setRenderList(newApps)
        return;
      };
      if (loadStatusApps.length) {
        setSize(size => size + 1)
        setRenderList(newApps);
      } else {
        setRenderList(newApps);
      }
    }
  }, [data, myApps]);


  return (
    <div style={customStyle} id="apps-parent-container">
      <BasicSidebar title={"未陌AI"} desc={"aaa"} noHeader={true} layout="apps" />
      <nav id="apps-container" className='grid content-start grid-cols-1 gap-4 px-12 pt-8 sm:grid-cols-2 lg:grid-cols-2 grow shrink-0' style={{ flex: 1, paddingRight: 0, paddingTop: 130, position: 'relative', overflowY: 'scroll', paddingBottom: 20 }}>
        <div onClick={() => setShowNewAppDialog(true)} style={{
          width: 176,
          height: 76,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 24,
          left: 46,
          background: 'white',
          borderRadius: 16,
          boxShadow: "0px 12px 26px rgba(90, 100, 120, 0.03)",
          cursor: 'pointer',
        }}>
          <div style={{
            width: 28,
            height: 28,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
            borderRadius: 4,
            background: "#181A24",
          }}>
            <img
              src="https://assets.metaio.cc/assets/difyassets/add-white.png"
              style={{
                width: 16,
                height: 16,
              }} />
          </div>
          <div style={{
            fontFamily: 'PingFang SC',
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: 20,
            color: "#19243B"
          }}>创建应用</div>
        </div>
        {
          // data?.map(({ data: apps }) => apps.map(app => (
          //   <AppCard key={app.id} app={app} onDelete={mutate} />
          // )))
          renderList.map(app => (
            <AppCard key={app.id} app={app} onDelete={mutate} />
          ))
        }
        <NewAppDialog show={showNewAppDialog} onSuccess={mutate} onClose={() => setShowNewAppDialog(false)} />
        {/* <NewAppCard ref={anchorRef} onSuccess={mutate} /> */}
      </nav >
      <div style={{ width: 480, height: 'auto', padding: 24 }}>
        <OverView />
      </div>
    </div >
  )
}

export default Apps
