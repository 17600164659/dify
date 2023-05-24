'use client'

import { useEffect, useState } from 'react'
import AppCard from './AppCard'
import NewAppCard from './NewAppCard'
import { useAppContext } from '@/context/app-context'
import BasicSidebar from "@/app/components/basic-sidebar";
import { fetchAppList } from '@/service/apps';

const customStyle = {
  display: 'flex',
  height: "100vh",
}

const Apps = () => {
  const { apps, mutateApps } = useAppContext()
  const [leftapps, setApps] = useState([]);

  const getData = async () => {
    const appsResult = await fetchAppList({ page: 1 });
    setApps(appsResult.data);
  }

  useEffect(() => {
    mutateApps();
    getData();
  }, [])

  return (
    <div style={customStyle}>
      <BasicSidebar title={"未陌AI"} desc={"aaa"} noHeader={true} />
      <nav style={{ width: "81vh" }} className='grid content-start grid-cols-1 gap-4 px-12 pt-8 sm:grid-cols-2 lg:grid-cols-4 grow shrink-0'>
        {apps.map(app => (<AppCard key={app.id} app={app} />))}
        <NewAppCard />
      </nav>
    </div>
  )
}

export default Apps
