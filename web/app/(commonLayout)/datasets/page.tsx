import classNames from 'classnames'
import { getLocaleOnServer } from '@/i18n/server'
import { useTranslation } from '@/i18n/i18next-serverside-config'
import Datasets from './Datasets'
import DatasetFooter from './DatasetFooter'
import BasicSidebar from "@/app/components/basic-sidebar";
import { fetchDatasets } from '@/service/datasets'
// import { useEffect, useState } from 'react'

const customStyle = {
  display: 'flex',
  height: "100vh",
}

export async function getStaticProps() {
  const appsResult = await fetchDatasets({ page: 1 });
  console.log(appsResult)
  return {
    props: {
      data: appsResult.data
    }
  }
}

const AppList = async (props) => {
  const locale = getLocaleOnServer()
  const { t } = await useTranslation(locale, 'dataset')

  return (
    <div style={customStyle}>
      <BasicSidebar title={"未陌AI"} desc={"aaa"} noHeader={true} layout="datasets" />
      <div style={{ width: "81vh" }} className='flex flex-col overflow-auto bg-gray-100 shrink-0 grow'>
        <Datasets />
        {/* <DatasetFooter /> */}
      </div >
    </div>
  )
}

export const metadata = {
  title: 'Datasets - iPollo.AI',
}

export default AppList
