'use client'
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBoolean } from 'ahooks'
import type { File, PreProcessingRule, Rules, FileIndexingEstimateResponse as IndexingEstimateResponse } from '@/models/datasets'
import {
  fetchDefaultProcessRule,
  createFirstDocument,
  createDocument,
  fetchFileIndexingEstimate as didFetchFileIndexingEstimate,
} from '@/service/datasets'
import type { CreateDocumentReq, createDocumentResponse } from '@/models/datasets'
import Button from '@/app/components/base/button'
import PreviewItem from './preview-item'
import Loading from '@/app/components/base/loading'
import { XMarkIcon } from '@heroicons/react/20/solid'

import cn from 'classnames'
import s from './index.module.css'
import Link from 'next/link'
import Toast from '@/app/components/base/toast'
import { formatNumber } from '@/utils/format'
import request from '@/service/request';
import './style.css';

type StepTwoProps = {
  hasSetAPIKEY: boolean,
  onSetting: () => void,
  datasetId?: string,
  indexingType?: string,
  file?: File,
  onStepChange: (delta: number) => void,
  updateIndexingTypeCache: (type: string) => void,
  updateResultCache: (res: createDocumentResponse) => void
}

enum SegmentType {
  AUTO = 'automatic',
  CUSTOM = 'custom',
}
enum IndexingType {
  QUALIFIED = 'high_quality',
  ECONOMICAL = 'economy',
}

const StepTwo = ({
  hasSetAPIKEY,
  onSetting,
  datasetId,
  indexingType,
  file,
  onStepChange,
  updateIndexingTypeCache,
  updateResultCache,
}: StepTwoProps) => {
  const { t } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const previewScrollRef = useRef<HTMLDivElement>(null)
  const [previewScrolled, setPreviewScrolled] = useState(false)
  const [segmentationType, setSegmentationType] = useState<SegmentType>(SegmentType.AUTO)
  const [segmentIdentifier, setSegmentIdentifier] = useState('\\n')
  const [max, setMax] = useState(1000)
  const [rules, setRules] = useState<PreProcessingRule[]>([])
  const [defaultConfig, setDefaultConfig] = useState<Rules>()
  const hasSetIndexType = !!indexingType
  const [indexType, setIndexType] = useState<IndexingType>(
    indexingType ||
      hasSetAPIKEY ? IndexingType.QUALIFIED : IndexingType.ECONOMICAL
  )
  const [showPreview, { setTrue: setShowPreview, setFalse: hidePreview }] = useBoolean()
  const [customFileIndexingEstimate, setCustomFileIndexingEstimate] = useState<IndexingEstimateResponse | null>(null)
  const [automaticFileIndexingEstimate, setAutomaticFileIndexingEstimate] = useState<IndexingEstimateResponse | null>(null)
  const fileIndexingEstimate = (() => {
    return segmentationType === SegmentType.AUTO ? automaticFileIndexingEstimate : customFileIndexingEstimate
  })()

  const scrollHandle = (e: any) => {
    if (e.target.scrollTop > 0) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }

  const previewScrollHandle = (e: any) => {
    if (e.target.scrollTop > 0) {
      setPreviewScrolled(true)
    } else {
      setPreviewScrolled(false)
    }
  }
  const getFileName = (name: string) => {
    const arr = name.split('.')
    return arr.slice(0, -1).join('.')
  }

  const getRuleName = (key: string) => {
    if (key === 'remove_extra_spaces') {
      return t('datasetCreation.stepTwo.removeExtraSpaces')
    }
    if (key === 'remove_urls_emails') {
      return t('datasetCreation.stepTwo.removeUrlEmails')
    }
    if (key === 'remove_stopwords') {
      return t('datasetCreation.stepTwo.removeStopwords')
    }
  }
  const ruleChangeHandle = (id: string) => {
    const newRules = rules.map(rule => {
      if (rule.id === id) {
        return {
          id: rule.id,
          enabled: !rule.enabled,
        }
      }
      return rule
    })
    setRules(newRules)
  }
  const resetRules = () => {
    if (defaultConfig) {
      setSegmentIdentifier(defaultConfig.segmentation.separator === '\n' ? '\\n' : defaultConfig.segmentation.separator || '\\n')
      setMax(defaultConfig.segmentation.max_tokens)
      setRules(defaultConfig.pre_processing_rules)
    }
  }

  const confirmChangeCustomConfig = async () => {
    setCustomFileIndexingEstimate(null)
    setShowPreview()
    await fetchFileIndexingEstimate()
  }

  const getIndexing_technique = () => indexingType ? indexingType : indexType

  const getProcessRule = () => {
    const processRule: any = {
      rules: {}, // api will check this. It will be removed after api refactored.
      mode: segmentationType,
    }
    if (segmentationType === SegmentType.CUSTOM) {
      const ruleObj = {
        pre_processing_rules: rules,
        segmentation: {
          separator: segmentIdentifier === '\\n' ? '\n' : segmentIdentifier,
          max_tokens: max,
        },
      }
      processRule.rules = ruleObj
    }
    return processRule
  }

  const getFileIndexingEstimateParams = () => {
    const params = {
      file_id: file?.id,
      dataset_id: datasetId,
      indexing_technique: getIndexing_technique(),
      process_rule: getProcessRule(),
    }
    return params
  }

  const fetchFileIndexingEstimate = async () => {
    const res = await didFetchFileIndexingEstimate(getFileIndexingEstimateParams())
    if (segmentationType === SegmentType.CUSTOM) {
      setCustomFileIndexingEstimate(res)
    }
    else {
      setAutomaticFileIndexingEstimate(res)
    }
  }

  const getCreationParams = () => {
    const params = {
      data_source: {
        type: 'upload_file',
        info: file?.id,
        name: file?.name,
      },
      indexing_technique: getIndexing_technique(),
      process_rule: getProcessRule(),
    } as CreateDocumentReq
    return params
  }

  const getRules = async () => {
    try {
      const res = await fetchDefaultProcessRule({ url: '/datasets/process-rule' })
      const separator = res.rules.segmentation.separator
      setSegmentIdentifier(separator === '\n' ? '\\n' : separator || '\\n')
      setMax(res.rules.segmentation.max_tokens)
      setRules(res.rules.pre_processing_rules)
      setDefaultConfig(res.rules)
    }
    catch (err) {
      console.log(err)
    }
  }
  const createHandle = async () => {
    try {
      let res;
      const params = getCreationParams()
      if (!datasetId) {
        res = await createFirstDocument({
          body: params
        })
        updateIndexingTypeCache(indexType)
        updateResultCache(res)
        const userId = window.localStorage.getItem('logined_menber');
        if (userId) {
          await request.post('/gpt', {
            type: 'saveDifyDatasets',
            userId,
            datasetId: res.dataset.id
          });
        }
      } else {
        res = await createDocument({
          datasetId,
          body: params
        })
        updateIndexingTypeCache(indexType)
        updateResultCache({
          document: res,
        })
      }
      onStepChange(+1)
    }
    catch (err) {
      Toast.notify({
        type: 'error',
        message: err + '',
      })
    }
  }

  useEffect(() => {
    // fetch rules
    getRules()
  }, [])

  useEffect(() => {
    scrollRef.current?.addEventListener('scroll', scrollHandle);
    return () => {
      scrollRef.current?.removeEventListener('scroll', scrollHandle);
    }
  }, [])

  useLayoutEffect(() => {
    if (showPreview) {
      previewScrollRef.current?.addEventListener('scroll', previewScrollHandle);
      return () => {
        previewScrollRef.current?.removeEventListener('scroll', previewScrollHandle);
      }
    }
  }, [showPreview])

  useEffect(() => {
    // get indexing type by props
    if (indexingType) {
      setIndexType(indexingType as IndexingType)
    } else {
      setIndexType(hasSetAPIKEY ? IndexingType.QUALIFIED : IndexingType.ECONOMICAL)
    }
  }, [hasSetAPIKEY, indexingType, datasetId])

  useEffect(() => {
    if (segmentationType === SegmentType.AUTO) {
      setAutomaticFileIndexingEstimate(null)
      setShowPreview()
      fetchFileIndexingEstimate()
    } else {
      hidePreview()
      setCustomFileIndexingEstimate(null)
    }
  }, [segmentationType, indexType])

  return (
    <div className='flex w-full h-full'>
      <div ref={scrollRef} className='relative h-full w-full overflow-y-scroll'>
        <div className={cn(s.pageHeader, scrolled && s.fixed)}>{t('datasetCreation.steps.two')}</div>
        <div className={cn(s.form)} style={{ paddingRight: 0 }}>
          <div className={s.label}>{t('datasetCreation.stepTwo.segmentation')}</div>
          <div className='max-w-[640px]'>

            <div
              className={cn(
                s.radioItem,
                s.segmentationItem,
                segmentationType === SegmentType.AUTO && s.active
              )}
              onClick={() => setSegmentationType(SegmentType.AUTO)}
              style={segmentationType === SegmentType.AUTO ? { border: "1px solid #5A6478", background: '#F1F3F9' } : { background: '#F1F3F9' }}
            >
              <div className='fdqx-icon'>
                <img className={cn(s.auto)} src="https://assets.metaio.cc/assets/difyassets/zdfd.png" />
              </div>
              {/* <span className={cn(s.typeIcon, s.auto)} /> */}
              {/* <span className={cn(s.radio)} /> */}
              <div className={s.typeHeader + ' custom-type-header'}>
                <div className={s.title}>{t('datasetCreation.stepTwo.auto')}</div>
                <div className={s.tip}>{t('datasetCreation.stepTwo.autoDescription')}</div>
              </div>
            </div>
            <div
              className={cn(
                s.radioItem,
                s.segmentationItem,
                segmentationType === SegmentType.CUSTOM && s.active,
                segmentationType === SegmentType.CUSTOM && s.custom,
              )}
              onClick={() => setSegmentationType(SegmentType.CUSTOM)}
              style={segmentationType === SegmentType.CUSTOM ? { border: "1px solid #5A6478", background: '#F1F3F9' } : { background: '#F1F3F9' }}
            >
              <div className='fdqx-icon'>
                <img className={cn(s.auto)} src="https://assets.metaio.cc/assets/difyassets/zdyfd.png" />
              </div>
              {/* <img className={cn(s.auto)} src="https://assets.metaio.cc/assets/difyassets/zdy.png" style={{ width: 31, height: 30, position: 'absolute', top: 19, left: 23 }} /> */}
              {/* <span className={cn(s.typeIcon, s.customize)} /> */}
              {/* <span className={cn(s.radio)} /> */}
              <div className={s.typeHeader + ' custom-type-header'}>
                <div className={s.title}>{t('datasetCreation.stepTwo.custom')}</div>
                <div className={s.tip}>{t('datasetCreation.stepTwo.customDescription')}</div>
              </div>
              {segmentationType === SegmentType.CUSTOM && (
                <div className={s.typeFormBody}>
                  <div className={s.formRow}>
                    <div className='w-full'>
                      <div className={s.label}>{t('datasetCreation.stepTwo.separator')}</div>
                      <input
                        type="text"
                        className={s.input}
                        placeholder={t('datasetCreation.stepTwo.separatorPlaceholder') || ''} value={segmentIdentifier}
                        onChange={(e) => setSegmentIdentifier(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={s.formRow}>
                    <div className='w-full'>
                      <div className={s.label}>{t('datasetCreation.stepTwo.maxLength')}</div>
                      <input
                        type="number"
                        className={s.input}
                        placeholder={t('datasetCreation.stepTwo.separatorPlaceholder') || ''} value={max}
                        onChange={(e) => setMax(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className={s.formRow}>
                    <div className='w-full'>
                      <div className={s.label}>{t('datasetCreation.stepTwo.rules')}</div>
                      {rules.map(rule => (
                        <div key={rule.id} className={s.ruleItem}>
                          <input id={rule.id} type="checkbox" defaultChecked={rule.enabled} onChange={() => ruleChangeHandle(rule.id)} className="w-4 h-4 rounded border-gray-300 text-blue-700 focus:ring-black" />
                          <label htmlFor={rule.id} className="ml-2 text-sm font-normal cursor-pointer text-gray-800">{getRuleName(rule.id)}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={s.formFooter}>
                    <Button borderRadius={1000} background="#181A24" type="primary" className={cn(s.button, '!h-8 text-primary-600')} onClick={confirmChangeCustomConfig}>{t('datasetCreation.stepTwo.preview')}</Button>
                    <Button borderRadius={1000} className={cn(s.button, 'ml-2 !h-8')} onClick={resetRules}>{t('datasetCreation.stepTwo.reset')}</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={s.label}>{t('datasetCreation.stepTwo.indexMode')}</div>
          <div className='max-w-[640px]'>
            <div className='flex items-center gap-3'>
              {(!hasSetIndexType || (hasSetIndexType && indexingType === IndexingType.QUALIFIED)) && (
                <div
                  className={cn(
                    s.radioItem,
                    s.indexItem,
                    !hasSetAPIKEY && s.disabled,
                    !hasSetIndexType && indexType === IndexingType.QUALIFIED && s.active,
                    hasSetIndexType && s.disabled,
                    hasSetIndexType && '!w-full',
                  )}
                  onClick={() => {
                    if (hasSetAPIKEY) {
                      setIndexType(IndexingType.QUALIFIED)
                    }
                  }}
                  style={!hasSetIndexType && indexType === IndexingType.QUALIFIED ? { border: "1px solid #5A6478", background: '#F1F3F9' } : { background: '#F1F3F9' }}
                >
                  <div className='fdqx-icon'>
                    <img className={cn(s.auto)} src="https://assets.metaio.cc/assets/difyassets/gzlfd.png" />
                  </div>
                  {/* <img src="https://assets.metaio.cc/assets/difyassets/gzl.png" className={cn(s.typeIcon)} style={{ width: 25, background: 'none' }} /> */}
                  {/* <span className={cn(s.typeIcon, s.qualified)} /> */}
                  {!hasSetIndexType && <span className={cn(s.radio)} />}
                  <div className={s.typeHeader + ' custom-type-header'}>
                    <div className={s.title}>
                      {t('datasetCreation.stepTwo.qualified')}
                      {!hasSetIndexType && <span className={s.recommendTag}>{t('datasetCreation.stepTwo.recommend')}</span>}
                    </div>
                    <div className={s.tip}>{t('datasetCreation.stepTwo.qualifiedTip')}</div>
                    <div className='pb-0.5 text-xs font-medium text-gray-500'>{t('datasetCreation.stepTwo.emstimateCost')}</div>
                    {
                      !!fileIndexingEstimate ? (
                        <div className='text-xs font-medium text-gray-800'>{formatNumber(fileIndexingEstimate.tokens)} tokens(<span className='text-yellow-500'>${formatNumber(fileIndexingEstimate.total_price)}</span>)</div>
                      ) : (
                        <div className={s.calculating}>{t('datasetCreation.stepTwo.calculating')}</div>
                      )
                    }
                  </div>
                  {!hasSetAPIKEY && (
                    <div className={s.warningTip}>
                      <span>{t('datasetCreation.stepTwo.warning')}&nbsp;</span>
                      <span className={s.click} onClick={onSetting}>{t('datasetCreation.stepTwo.click')}</span>
                    </div>
                  )}
                </div>
              )}


              {(!hasSetIndexType || (hasSetIndexType && indexingType === IndexingType.ECONOMICAL)) && (
                <div
                  className={cn(
                    s.radioItem,
                    s.indexItem,
                    !hasSetIndexType && indexType === IndexingType.ECONOMICAL && s.active,
                    hasSetIndexType && s.disabled,
                    hasSetIndexType && '!w-full',
                  )}
                  onClick={() => !hasSetIndexType && setIndexType(IndexingType.ECONOMICAL)}
                  style={!hasSetIndexType && indexType === IndexingType.ECONOMICAL ? { border: "1px solid #5A6478", background: '#F1F3F9' } : { background: '#F1F3F9' }}
                >
                  <div className='fdqx-icon'>
                    <img className={cn(s.auto)} src="https://assets.metaio.cc/assets/difyassets/jjfd.png" />
                  </div>
                  {/* <img src="https://assets.metaio.cc/assets/difyassets/jj.png" className={cn(s.typeIcon)} style={{ width: 34, background: 'none' }} /> */}
                  {/* <span className={cn(s.typeIcon, s.economical)} /> */}
                  {!hasSetIndexType && <span className={cn(s.radio)} />}
                  <div className={s.typeHeader + ' custom-type-header'}>
                    <div className={s.title}>{t('datasetCreation.stepTwo.economical')}</div>
                    <div className={s.tip}>{t('datasetCreation.stepTwo.economicalTip')}</div>
                    <div className='pb-0.5 text-xs font-medium text-gray-500'>{t('datasetCreation.stepTwo.emstimateCost')}</div>
                    <div className='text-xs font-medium text-gray-800'>0 tokens</div>
                  </div>
                </div>
              )}
            </div>
            {hasSetIndexType && (
              <div className='mt-2 text-xs text-gray-500 font-medium'>
                {t('datasetCreation.stepTwo.indexSettedTip')}
                <Link className='text-[#155EEF]' href={`/datasets/${datasetId}/settings`}>{t('datasetCreation.stepTwo.datasetSettingLink')}</Link>
              </div>
            )}
            <div className={s.file + ' custom-file'}>
              <div className={'custom-file-content'} style={{ width: 480 }}>
                <div className='mb-2 text-xs font-medium text-gray-500'>{t('datasetCreation.stepTwo.fileName')}</div>
                <div className='flex items-center text-sm leading-6 font-medium text-gray-800'>
                  {/* <span className={cn(s.fileIcon, file && s[file.extension])} /> */}
                  <div className='fdqx-icon' style={{ position: 'inherit', marginRight: 25 }}>
                    <img className={cn(s.auto)} src="https://assets.metaio.cc/assets/difyassets/jjfd.png" />
                  </div>
                  {getFileName(file?.name || '')}
                </div>
              </div>
              {/* <div className={s.divider} /> */}
              <div className={'custom-file-content'} style={{ height: 120, width: 124, marginRight: 0 }}>
                <div className='mb-2 text-xs font-medium text-gray-500'>{t('datasetCreation.stepTwo.emstimateSegment')}</div>
                <div className='flex items-center text-sm leading-6 font-medium text-gray-800'>
                  {
                    !!fileIndexingEstimate ? (
                      <div className='text-xs font-medium text-gray-800'>{formatNumber(fileIndexingEstimate.total_segments)} </div>
                    ) : (
                      <div className={s.calculating}>{t('datasetCreation.stepTwo.calculating')}</div>
                    )
                  }
                </div>
              </div>
            </div>
            <div className='flex items-center mt-8 py-2'>
              <Button borderRadius={1000} onClick={() => onStepChange(-1)}>{t('datasetCreation.stepTwo.lastStep')}</Button>
              <div className={s.divider} />
              <Button borderRadius={1000} background="#181A24" type='primary' onClick={createHandle}>{t('datasetCreation.stepTwo.nextStep')}</Button>
            </div>
          </div>
        </div>
      </div>
      {(showPreview) ? (
        <div ref={previewScrollRef} className={cn(s.previewWrap, 'relativeh-full overflow-y-scroll border-l border-[#F2F4F7]')}>
          <div className={cn(s.previewHeader, previewScrolled && `${s.fixed} pb-3`, ' flex items-center justify-between px-8')}>
            <span>{t('datasetCreation.stepTwo.previewTitle')}</span>
            <div className='flex items-center justify-center w-6 h-6 cursor-pointer' onClick={hidePreview}>
              <XMarkIcon className='h-4 w-4'></XMarkIcon>
            </div>
          </div>
          <div className='my-4 px-8 space-y-4'>
            {fileIndexingEstimate?.preview ? (
              <>
                {fileIndexingEstimate?.preview.map((item, index) => (
                  <PreviewItem key={item} content={item} index={index + 1} />
                ))}
              </>
            ) : <div className='flex items-center justify-center h-[200px]'><Loading type='area'></Loading></div>
            }
          </div>
        </div>
      ) :
        (<div className={cn(s.sideTip)}>
          <div className={s.tipCard}>
            <span className={s.icon} />
            <div className={s.title}>{t('datasetCreation.stepTwo.sideTipTitle')}</div>
            <div className={s.content}>
              <p className='mb-3'>{t('datasetCreation.stepTwo.sideTipP1')}</p>
              <p className='mb-3'>{t('datasetCreation.stepTwo.sideTipP2')}</p>
              <p className='mb-3'>{t('datasetCreation.stepTwo.sideTipP3')}</p>
              <p>{t('datasetCreation.stepTwo.sideTipP4')}</p>
            </div>
          </div>
        </div>)}
    </div>
  )
}

export default StepTwo
