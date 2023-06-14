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
          body: {
            data_source: { type: "upload_file", info: "413840cf-ec08-4767-a011-e21e5df09b50", name: "419-元宇AI健康助手.pdf" },
            indexing_technique: "high_quality",
            process_rule: { rules: {}, mode: "automatic" }
          }
        })
        updateIndexingTypeCache(indexType)
        updateResultCache(res)
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
      {/* {(showPreview) ? ( */}
      {true ? (
        <div ref={previewScrollRef} className={cn(s.previewWrap, 'relativeh-full overflow-y-scroll border-l border-[#F2F4F7]')}>
          <div className={cn(s.previewHeader, previewScrolled && `${s.fixed} pb-3`, ' flex items-center justify-between px-8')}>
            <span>{t('datasetCreation.stepTwo.previewTitle')}</span>
            <div className='flex items-center justify-center w-6 h-6 cursor-pointer' onClick={hidePreview}>
              <XMarkIcon className='h-4 w-4'></XMarkIcon>
            </div>
          </div>
          <div className='my-4 px-8 space-y-4'>
            {[
              "AI\u667a\u80fd\u79c1\u4eba\u5065\u5eb7\u89e3\u51b3\u65b9\u6848\uff0c\u60a8\u7684\u4e13\u5c5e\u5065\u5eb7\u52a9\u7406\u5143\u5b87AI\u5065\u5eb7\u52a9\u624b",
              "\u7528AI\u6784\u5efa\u966a\u4f34\u5f0f\u5065\u5eb7\u7ba1\u7406\uff0c\u5b9e\u73b0\u5168\u6c11\u5065\u5eb7\u65e0\u5fe7\u3002\u5229\u7528AI\u6280\u672f\u4e3a\u6bcf\u4eba\u91cf\u8eab\u6253\u9020\u966a\u4f34\u5f0f\u5065\u5eb7\u7ba1\u7406\u673a\u5668\u4eba\u3002\u7ed3\u5408\u884c\u4e3a\u3001\u5bf9\u8bdd\u548c\u6570\u636e\u5206\u6790\uff0c\u63d0\u4f9b\u4e2a\u6027\u5316\u5065\u5eb7\u65b9\u6848\u3002\u4e0e\u9876\u7ea7\u533b\u751f\u5408\u4f5c\uff0c\u5c06\u4e13\u4e1a\u7ecf\u9a8c\u8f6c\u5316\u4e3a24/7\u670d\u52a1\u7684AI\u673a\u5668\u4eba\u3002\u4ee5\u4eba\u4e3a\u672c\uff1a\u5173\u6ce8\u4eba\u4eec\u7684\u5065\u5eb7\u9700\u6c42\uff0c\u63d0\u4f9b\u5168\u9762\u3001\u8d34\u5fc3\u7684\u966a\u4f34\u5f0f\u5065\u5eb7\u670d\u52a1\u3002 \u521b\u65b0\u9a71\u52a8\uff1a\u8ffd\u6c42\u6280\u672f\u521b\u65b0\uff0c\u4e0d\u65ad\u4f18\u5316\u966a\u4f34\u5f0f\u5065\u5eb7\u7ba1\u7406\u52a9\u624b\uff0c\u63d0\u4f9b\u667a\u80fd\u3001\u4eba\u6027\u5316\u670d\u52a1\u3002 \u4e13\u4e1a\u81f3\u4e0a\uff1a\u4e0e\u9876\u7ea7\u533b\u751f\u5408\u4f5c\uff0c\u63d0\u4f9b\u4e13\u4e1a\u3001\u53ef\u9760\u7684\u5065\u5eb7\u5efa\u8bae\u548c\u670d\u52a1\u3002 \u5408\u4f5c\u5171\u8d62\uff1a\u643a\u624b\u533b\u7597\u754c\u5404\u65b9\u5171\u540c\u63a8\u52a8\u966a\u4f34\u5f0f\u5065\u5eb7\u7ba1\u7406\u884c\u4e1a\u53d1\u5c55\u3002\u6211\u4eec\u7684\u613f\u666fVision\u6211\u4eec\u7684\u4f7f\u547dMisson\u6838\u5fc3\u4ef7\u503c\u89c2Core Values\n2\u4e0e\u5176\u4ed6\u95ee\u7b54AI\u4e0d\u540c\uff0c\u6211\u4eec\u7684\u4ea7\u54c1\u80fd\u591f\u8bb0\u4f4f\u60a8\u7684\u559c\u597d\u3001\u5386\u53f2\u75c5\u4f8b\u548c\u66fe\u7ecf\u63d0\u51fa\u7684\u95ee\u9898\uff0c\u50cf\u4e00\u4e2a24\u5c0f\u65f6\u4e0d\u79bb\u5f00\u7684\u5065\u5eb7\u987e\u95ee\u4e00\u6837\u4e0e\u60a8\u76f8\u4f34\u3002\u9996\u6b3e\u966a\u4f34\u5f0fAI\u5065\u5eb7\u52a9\u624b\u6211\u4eec\u7684\u521b\u59cb\u56e2\u961f\u6210\u5458\u6765\u81ea\u54c8\u4f5b\u3001\u5317\u5927\u3001\u54e5\u4f26\u6bd4\u4e9a\u5927\u5b66\u7b49\u5168\u7403\u9876\u7ea7\u540d\u6821\uff0c\u62e5\u6709\u535a\u58eb\u540e\u5b66\u4f4d\u548c\u4e30\u5bcc\u7684\u884c\u4e1a\u7ecf\u9a8c\u3002\u6765\u81ea\u9876\u5c16\u540d\u6821\u7684\u521b\u59cb\u56e2\u961f\n\u6211\u4eec\u7684\u4ea7\u54c1\u662f\u9996\u6b3e\u652f\u6301\u65e0\u4ee3\u7801\u8bad\u7ec3\u7684AI\u52a9\u624b\u3002\u6bcf\u4e2a\u533b\u751f\u90fd\u53ef\u4ee5\u5c06\u81ea\u5df1\u5b9d\u8d35\u7684\u533b\u7597\u7ecf\u9a8c\u7528\u4e8e\u8bad\u7ec3\u6a21\u578b\uff0c\u5efa\u7acb\u81ea\u5df1\u7684\u77e5\u8bc6\u4f53\u7cfb\uff0c\u4f7f\u4ed6\u4eec\u7684\u667a\u6167\u5f97\u4ee5\u5e7f\u6cdb\u670d\u52a1\u4eba\u7c7b",
              "\u65e0\u4ee3\u7801\u8bad\u7ec3\u81ea\u4e3b\u5c0f\u6a21\u578b\u4e0e\u4f20\u7edf\u7684\u95ee\u7b54AI\u4e0d\u540c\uff0c\u6211\u4eec\u7684\u4ea7\u54c1\u5177\u6709\u4e3b\u52a8\u5f0f\u4efb\u52a1\u5904\u7406\u80fd\u529b\u3002\u5b83\u4e0d\u4ec5\u9650\u4e8e\u56de\u7b54\u63d0\u95ee\uff0c\u8fd8\u80fd\u6839\u636e\u7528\u6237\u9047\u5230\u7684\u95ee\u9898\u3001\u4e60\u60ef\u548c\u884c\u4e3a\u4e3b\u52a8\u89e6\u53d1\uff0c\u5e2e\u52a9\u7528\u6237\u89e3\u51b3\u95ee\u9898\u3002\u4e3b\u52a8\u5f0f\u4efb\u52a1AI\u4ea7\u54c1\n1\n4\n3\u4ea7\u54c1\u4eae\u70b9\n\u9879\u76ee\u80cc\u666fProject Background\u5e02\u573a\u4e0e\u673a\u9047Market Status and Opportunities\u89e3\u51b3\u65b9\u6848Solution\u56e2\u961f\u4ecb\u7ecdT eam Introduction\u76ee\u5f55Catalog\n\u9879\u76ee\u80cc\u666fProject Background\n\u533b\u7597\u5668\u68b0\u4e0e\u8bca\u65ad1\u4e07\u4ebf\u5143\n\u533b\u836f2.5\u4e07\u4ebf\u5143\n\u533b\u7597\u670d\u52a1\u3001\u6570\u5b57\u533b\u7597&\u6cdb\u5065\u5eb76.5\u4e07\u4ebf\u51432022\u5e74\u4e2d\u56fd\n\u5065\u5eb7\u4ea7\u4e1a\u89c4\u6a2110\u4e07\u4ebf\u5143\u6570\u636e\u6765\u6e90\uff1a\u6613\u51ef\u8d44\u672c\n\u300a2022\u6613\u51ef\u8d44\u672c\u4e2d\u56fd\u5065\u5eb7\u4ea7\u4e1a\u767d\u76ae\u4e66\u300b\n01000200030004000\n201620172018201920202021E2022E2023E\n2016-2023\u5e74 \u4e2d\u56fdAI+\u5065\u5eb7\u7ba1\u7406\u5e02\u573a\u89c4\u6a21\u53ca\u9884\u6d4b 3364\u4ebf\u5143\u5355\u4f4d\uff1a\u4ebf\u5143 \u4eba\u6c11\u5e01\n\u6570\u636e\u6765\u6e90\uff1a\u6c99\u5229\u6587\u00b7\u6613\u89c2\u5206\u6790\u6574\u740616721777209023732544281130853364\u5f53\u4ecaAI+\u5065\u5eb7\u7ba1\u7406\u7684\u5e02\u573a\u89c4\u6a21\u5de8\u5927\n\u653f\u7b56\u4e3aAI+\u5065\u5eb7\u7ba1\u7406\u53d1\u5c55\u521b\u9020\u6761\u4ef6\u79d1\u6280\u6210\u679c\u8f6c\u5316\u56fd\u4ea7\u5316\u6570\u636e\u5171\u4eab\u884c\u4e1a\u6807\u51c6\n\u89c4\u8303\u4f53\u7cfb\u2022\u8fd1\u5e74\u6765\uff0c\u591a\u4e2a\u6587\u4ef6\u5c06\u4eba\u5de5\u667a\u80fd\u5728\u533b\u7597\u5065\u5eb7\u9886\u57df\u7684\u5e94\u7528\u5199\u5165\u53d1\u5c55\u89c4\u5212\uff0c\u533b\u7597AI\u8fce\u6765\u53d1\u5c55\u5229\u597d\u3002\u5404\u7701\u5e02\u987a\u52bf\u53d1\u5e03\u4e13\u9879\u653f\u7b56, \u4e3a\u533b\u7597AI\u7684\u53d1\u5c55\u5efa\u8bbe\u5b8c\u6574\u7684\u652f\u6491\u4f53\u7cfb\u3002\u653f\u7b56\u4e3a\u533b\u7597AI\u53d1\u5c55\u63d0\u4f9b\u673a\u9047\u2022\u4ece\u6574\u4f53\u89c4\u5212\u6765\u770b\uff0c\u533b\u7597AI\u884c\u4e1a\u8fd8\u5c06\u7ee7\u7eed\u4eab\u53d7\u653f\u7b56\u7ea2\u5229\u3002\u653f\u7b56\u5c06\u63a8\u52a8\u6210\u679c\u8f6c\u5316\uff0c\u52a0\u901f\u533b\u7597AI\u5e94\u7528\u843d\u5730\uff0c\u6301\u7eed\u5b8c\u5584\u6807\u51c6\u89c4\u8303\u4f53\u7cfb",
              "\u4f46\u540c\u65f6\uff0c\u968f\u7740\u6807\u51c6\u4f53\u7cfb\u7684\u5efa\u7acb, \u4f01\u4e1a\u4e5f\u5c06\u9762\u4e34\u66f4\u9ad8\u7684\u6280\u672f\u4e0e\u5408\u89c4\u95e8\u69db\u3002\u53ea\u6709\u628a\u63e1\u6838\u5fc3\u6280\u672f\uff0c\u6301\u7eed\u6295\u5165\u7814\u53d1\u4e0e\u521b\u65b0\uff0c\u624d\u80fd\u628a\u63e1\u53d1\u5c55\u673a\u9047\uff0c\u5efa\u7acb\u7262\u56fa\u7684\u7ade\u4e89\u58c1\u5792",
              "AI+\u5065\u5eb7\u7ba1\u7406\u83b7\u5f97\u653f\u7b56\u7684\u5927\u529b\u652f\u6301\n\u5e02\u573a\u4e0e\u673a\u9047Market Status and Opportunities\n\u4e2d\u56fd\u57ce\u5e02\u9752\u5e74\n\u7684\u81ea\u8bc4\u5065\u5eb7\n\u8f83\u597d50.92%\n\u5f88\u597d21.77%\n\u4e00\u822c22.82%\n\u8f83\u5dee3.90%\n\u5f88\u5dee0.57%\n\u4e2d\u56fd\u57ce\u5e02\u9752\u5e74\u9ad8\u6536\u5165-\u4f4e\u5065\u5eb7\u8d8b\u52bf\u4e2d\u56fd\u57ce\u5e02\u9752\u5e74\u7684\u81ea\u8bc4\u5065\u5eb7-\u5e74\u9f84\u4e0e\u6027\u522b\u7684\u5dee\u5f02\n\u4e2d\u56fd\u57ce\u5e02\u9752\u5e74\u7684\u5065\u5eb7\u56f0\u6270\u6392\u5e8f\n\u4e2d\u56fd\u57ce\u5e02\u9752\u5e74\u5bf9\n\u5065\u5eb7\u4fe1\u606f\n\u7684\u5173\u6ce8\u7a0b\u5ea6\n\u6bd4\u8f83\u5173\u6ce849.90%\n\u975e\u5e38\u5173\u6ce815.68%\n\u4e00\u822c27 .43%\n\u4e0d\u662f\u5f88\u5173\u6ce86"
            ] ? (
              <>
                {[
                  "AI\u667a\u80fd\u79c1\u4eba\u5065\u5eb7\u89e3\u51b3\u65b9\u6848\uff0c\u60a8\u7684\u4e13\u5c5e\u5065\u5eb7\u52a9\u7406\u5143\u5b87AI\u5065\u5eb7\u52a9\u624b",
                  "\u7528AI\u6784\u5efa\u966a\u4f34\u5f0f\u5065\u5eb7\u7ba1\u7406\uff0c\u5b9e\u73b0\u5168\u6c11\u5065\u5eb7\u65e0\u5fe7\u3002\u5229\u7528AI\u6280\u672f\u4e3a\u6bcf\u4eba\u91cf\u8eab\u6253\u9020\u966a\u4f34\u5f0f\u5065\u5eb7\u7ba1\u7406\u673a\u5668\u4eba\u3002\u7ed3\u5408\u884c\u4e3a\u3001\u5bf9\u8bdd\u548c\u6570\u636e\u5206\u6790\uff0c\u63d0\u4f9b\u4e2a\u6027\u5316\u5065\u5eb7\u65b9\u6848\u3002\u4e0e\u9876\u7ea7\u533b\u751f\u5408\u4f5c\uff0c\u5c06\u4e13\u4e1a\u7ecf\u9a8c\u8f6c\u5316\u4e3a24/7\u670d\u52a1\u7684AI\u673a\u5668\u4eba\u3002\u4ee5\u4eba\u4e3a\u672c\uff1a\u5173\u6ce8\u4eba\u4eec\u7684\u5065\u5eb7\u9700\u6c42\uff0c\u63d0\u4f9b\u5168\u9762\u3001\u8d34\u5fc3\u7684\u966a\u4f34\u5f0f\u5065\u5eb7\u670d\u52a1\u3002 \u521b\u65b0\u9a71\u52a8\uff1a\u8ffd\u6c42\u6280\u672f\u521b\u65b0\uff0c\u4e0d\u65ad\u4f18\u5316\u966a\u4f34\u5f0f\u5065\u5eb7\u7ba1\u7406\u52a9\u624b\uff0c\u63d0\u4f9b\u667a\u80fd\u3001\u4eba\u6027\u5316\u670d\u52a1\u3002 \u4e13\u4e1a\u81f3\u4e0a\uff1a\u4e0e\u9876\u7ea7\u533b\u751f\u5408\u4f5c\uff0c\u63d0\u4f9b\u4e13\u4e1a\u3001\u53ef\u9760\u7684\u5065\u5eb7\u5efa\u8bae\u548c\u670d\u52a1\u3002 \u5408\u4f5c\u5171\u8d62\uff1a\u643a\u624b\u533b\u7597\u754c\u5404\u65b9\u5171\u540c\u63a8\u52a8\u966a\u4f34\u5f0f\u5065\u5eb7\u7ba1\u7406\u884c\u4e1a\u53d1\u5c55\u3002\u6211\u4eec\u7684\u613f\u666fVision\u6211\u4eec\u7684\u4f7f\u547dMisson\u6838\u5fc3\u4ef7\u503c\u89c2Core Values\n2\u4e0e\u5176\u4ed6\u95ee\u7b54AI\u4e0d\u540c\uff0c\u6211\u4eec\u7684\u4ea7\u54c1\u80fd\u591f\u8bb0\u4f4f\u60a8\u7684\u559c\u597d\u3001\u5386\u53f2\u75c5\u4f8b\u548c\u66fe\u7ecf\u63d0\u51fa\u7684\u95ee\u9898\uff0c\u50cf\u4e00\u4e2a24\u5c0f\u65f6\u4e0d\u79bb\u5f00\u7684\u5065\u5eb7\u987e\u95ee\u4e00\u6837\u4e0e\u60a8\u76f8\u4f34\u3002\u9996\u6b3e\u966a\u4f34\u5f0fAI\u5065\u5eb7\u52a9\u624b\u6211\u4eec\u7684\u521b\u59cb\u56e2\u961f\u6210\u5458\u6765\u81ea\u54c8\u4f5b\u3001\u5317\u5927\u3001\u54e5\u4f26\u6bd4\u4e9a\u5927\u5b66\u7b49\u5168\u7403\u9876\u7ea7\u540d\u6821\uff0c\u62e5\u6709\u535a\u58eb\u540e\u5b66\u4f4d\u548c\u4e30\u5bcc\u7684\u884c\u4e1a\u7ecf\u9a8c\u3002\u6765\u81ea\u9876\u5c16\u540d\u6821\u7684\u521b\u59cb\u56e2\u961f\n\u6211\u4eec\u7684\u4ea7\u54c1\u662f\u9996\u6b3e\u652f\u6301\u65e0\u4ee3\u7801\u8bad\u7ec3\u7684AI\u52a9\u624b\u3002\u6bcf\u4e2a\u533b\u751f\u90fd\u53ef\u4ee5\u5c06\u81ea\u5df1\u5b9d\u8d35\u7684\u533b\u7597\u7ecf\u9a8c\u7528\u4e8e\u8bad\u7ec3\u6a21\u578b\uff0c\u5efa\u7acb\u81ea\u5df1\u7684\u77e5\u8bc6\u4f53\u7cfb\uff0c\u4f7f\u4ed6\u4eec\u7684\u667a\u6167\u5f97\u4ee5\u5e7f\u6cdb\u670d\u52a1\u4eba\u7c7b",
                  "\u65e0\u4ee3\u7801\u8bad\u7ec3\u81ea\u4e3b\u5c0f\u6a21\u578b\u4e0e\u4f20\u7edf\u7684\u95ee\u7b54AI\u4e0d\u540c\uff0c\u6211\u4eec\u7684\u4ea7\u54c1\u5177\u6709\u4e3b\u52a8\u5f0f\u4efb\u52a1\u5904\u7406\u80fd\u529b\u3002\u5b83\u4e0d\u4ec5\u9650\u4e8e\u56de\u7b54\u63d0\u95ee\uff0c\u8fd8\u80fd\u6839\u636e\u7528\u6237\u9047\u5230\u7684\u95ee\u9898\u3001\u4e60\u60ef\u548c\u884c\u4e3a\u4e3b\u52a8\u89e6\u53d1\uff0c\u5e2e\u52a9\u7528\u6237\u89e3\u51b3\u95ee\u9898\u3002\u4e3b\u52a8\u5f0f\u4efb\u52a1AI\u4ea7\u54c1\n1\n4\n3\u4ea7\u54c1\u4eae\u70b9\n\u9879\u76ee\u80cc\u666fProject Background\u5e02\u573a\u4e0e\u673a\u9047Market Status and Opportunities\u89e3\u51b3\u65b9\u6848Solution\u56e2\u961f\u4ecb\u7ecdT eam Introduction\u76ee\u5f55Catalog\n\u9879\u76ee\u80cc\u666fProject Background\n\u533b\u7597\u5668\u68b0\u4e0e\u8bca\u65ad1\u4e07\u4ebf\u5143\n\u533b\u836f2.5\u4e07\u4ebf\u5143\n\u533b\u7597\u670d\u52a1\u3001\u6570\u5b57\u533b\u7597&\u6cdb\u5065\u5eb76.5\u4e07\u4ebf\u51432022\u5e74\u4e2d\u56fd\n\u5065\u5eb7\u4ea7\u4e1a\u89c4\u6a2110\u4e07\u4ebf\u5143\u6570\u636e\u6765\u6e90\uff1a\u6613\u51ef\u8d44\u672c\n\u300a2022\u6613\u51ef\u8d44\u672c\u4e2d\u56fd\u5065\u5eb7\u4ea7\u4e1a\u767d\u76ae\u4e66\u300b\n01000200030004000\n201620172018201920202021E2022E2023E\n2016-2023\u5e74 \u4e2d\u56fdAI+\u5065\u5eb7\u7ba1\u7406\u5e02\u573a\u89c4\u6a21\u53ca\u9884\u6d4b 3364\u4ebf\u5143\u5355\u4f4d\uff1a\u4ebf\u5143 \u4eba\u6c11\u5e01\n\u6570\u636e\u6765\u6e90\uff1a\u6c99\u5229\u6587\u00b7\u6613\u89c2\u5206\u6790\u6574\u740616721777209023732544281130853364\u5f53\u4ecaAI+\u5065\u5eb7\u7ba1\u7406\u7684\u5e02\u573a\u89c4\u6a21\u5de8\u5927\n\u653f\u7b56\u4e3aAI+\u5065\u5eb7\u7ba1\u7406\u53d1\u5c55\u521b\u9020\u6761\u4ef6\u79d1\u6280\u6210\u679c\u8f6c\u5316\u56fd\u4ea7\u5316\u6570\u636e\u5171\u4eab\u884c\u4e1a\u6807\u51c6\n\u89c4\u8303\u4f53\u7cfb\u2022\u8fd1\u5e74\u6765\uff0c\u591a\u4e2a\u6587\u4ef6\u5c06\u4eba\u5de5\u667a\u80fd\u5728\u533b\u7597\u5065\u5eb7\u9886\u57df\u7684\u5e94\u7528\u5199\u5165\u53d1\u5c55\u89c4\u5212\uff0c\u533b\u7597AI\u8fce\u6765\u53d1\u5c55\u5229\u597d\u3002\u5404\u7701\u5e02\u987a\u52bf\u53d1\u5e03\u4e13\u9879\u653f\u7b56, \u4e3a\u533b\u7597AI\u7684\u53d1\u5c55\u5efa\u8bbe\u5b8c\u6574\u7684\u652f\u6491\u4f53\u7cfb\u3002\u653f\u7b56\u4e3a\u533b\u7597AI\u53d1\u5c55\u63d0\u4f9b\u673a\u9047\u2022\u4ece\u6574\u4f53\u89c4\u5212\u6765\u770b\uff0c\u533b\u7597AI\u884c\u4e1a\u8fd8\u5c06\u7ee7\u7eed\u4eab\u53d7\u653f\u7b56\u7ea2\u5229\u3002\u653f\u7b56\u5c06\u63a8\u52a8\u6210\u679c\u8f6c\u5316\uff0c\u52a0\u901f\u533b\u7597AI\u5e94\u7528\u843d\u5730\uff0c\u6301\u7eed\u5b8c\u5584\u6807\u51c6\u89c4\u8303\u4f53\u7cfb",
                  "\u4f46\u540c\u65f6\uff0c\u968f\u7740\u6807\u51c6\u4f53\u7cfb\u7684\u5efa\u7acb, \u4f01\u4e1a\u4e5f\u5c06\u9762\u4e34\u66f4\u9ad8\u7684\u6280\u672f\u4e0e\u5408\u89c4\u95e8\u69db\u3002\u53ea\u6709\u628a\u63e1\u6838\u5fc3\u6280\u672f\uff0c\u6301\u7eed\u6295\u5165\u7814\u53d1\u4e0e\u521b\u65b0\uff0c\u624d\u80fd\u628a\u63e1\u53d1\u5c55\u673a\u9047\uff0c\u5efa\u7acb\u7262\u56fa\u7684\u7ade\u4e89\u58c1\u5792",
                  "AI+\u5065\u5eb7\u7ba1\u7406\u83b7\u5f97\u653f\u7b56\u7684\u5927\u529b\u652f\u6301\n\u5e02\u573a\u4e0e\u673a\u9047Market Status and Opportunities\n\u4e2d\u56fd\u57ce\u5e02\u9752\u5e74\n\u7684\u81ea\u8bc4\u5065\u5eb7\n\u8f83\u597d50.92%\n\u5f88\u597d21.77%\n\u4e00\u822c22.82%\n\u8f83\u5dee3.90%\n\u5f88\u5dee0.57%\n\u4e2d\u56fd\u57ce\u5e02\u9752\u5e74\u9ad8\u6536\u5165-\u4f4e\u5065\u5eb7\u8d8b\u52bf\u4e2d\u56fd\u57ce\u5e02\u9752\u5e74\u7684\u81ea\u8bc4\u5065\u5eb7-\u5e74\u9f84\u4e0e\u6027\u522b\u7684\u5dee\u5f02\n\u4e2d\u56fd\u57ce\u5e02\u9752\u5e74\u7684\u5065\u5eb7\u56f0\u6270\u6392\u5e8f\n\u4e2d\u56fd\u57ce\u5e02\u9752\u5e74\u5bf9\n\u5065\u5eb7\u4fe1\u606f\n\u7684\u5173\u6ce8\u7a0b\u5ea6\n\u6bd4\u8f83\u5173\u6ce849.90%\n\u975e\u5e38\u5173\u6ce815.68%\n\u4e00\u822c27 .43%\n\u4e0d\u662f\u5f88\u5173\u6ce86"
                ].map((item, index) => (
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
