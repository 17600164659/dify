'use client'

import { useEffect, useRef } from 'react'
import useSWRInfinite from 'swr/infinite'
import { debounce } from 'lodash-es';
import { DataSetListResponse } from '@/models/datasets';
import NewDatasetCard from './NewDatasetCard'
import DatasetCard from './DatasetCard';
import { fetchDatasets } from '@/service/datasets';
import { useSelector } from '@/context/app-context';

const getKey = (pageIndex: number, previousPageData: DataSetListResponse) => {
  if (!pageIndex || previousPageData.has_more)
    return { url: 'datasets', params: { page: pageIndex + 1, limit: 30 } }
  return null
}

const Datasets = () => {
  const { data, isLoading, setSize, mutate } = useSWRInfinite(getKey, fetchDatasets, { revalidateFirstPage: false })
  const loadingStateRef = useRef(false)
  const pageContainerRef = useSelector(state => state.pageContainerRef)
  const anchorRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    loadingStateRef.current = isLoading
  }, [isLoading])

  useEffect(() => {
    const onScroll = debounce(() => {
      if (!loadingStateRef.current) {
        const { scrollTop, clientHeight } = pageContainerRef?.current!
        const anchorOffset = anchorRef.current!.offsetTop
        if (anchorOffset - scrollTop - clientHeight < 100) {
          setSize(size => size + 1)
        }
      }
    }, 50)

    pageContainerRef?.current?.addEventListener('scroll', onScroll)
    return () => pageContainerRef?.current?.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className='grid content-start grid-cols-1 gap-4 px-12 pt-8 sm:grid-cols-2 lg:grid-cols-3 grow shrink-0' style={{ flex: 1, paddingRight: 0, paddingTop: 130, position: 'relative' }}>
      <a style={{
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
      }} href='/datasets/create'>
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
        }}>创建数据集</div>
      </a>
      {data?.map(({ data: datasets }) => datasets.map(dataset => (
        <DatasetCard key={dataset.id} dataset={dataset} onDelete={mutate} />)
      ))}
      {data?.map(({ data: datasets }) => datasets.map(dataset => (
        <DatasetCard key={dataset.id} dataset={dataset} onDelete={mutate} />)
      ))}
      {/* <NewDatasetCard ref={anchorRef} /> */}
    </nav>
  )
}

export default Datasets

