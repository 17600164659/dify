'use client'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import s from './index.module.css'
import { DataSet } from '@/models/datasets'

const itemClass = `
  w-[234px] p-3 rounded-xl bg-gray-25 border border-gray-100 cursor-pointer
`
const radioClass = `
  w-4 h-4 border-[2px] border-gray-200 rounded-full
`
type IIndexMethodRadioProps = {
  value?: DataSet['indexing_technique']
  onChange: (v?: DataSet['indexing_technique']) => void
}

const IndexMethodRadio = ({
  value,
  onChange
}: IIndexMethodRadioProps) => {
  const { t } = useTranslation()
  const options = [
    {
      key: 'high_quality',
      text: t('datasetSettings.form.indexMethodHighQuality'),
      desc: t('datasetSettings.form.indexMethodHighQualityTip'),
      // icon: 'high-quality'
      icon: 'https://assets.metaio.cc/assets/difyassets/gzl.png',
      w: 14,
      h: 20,
    },
    {
      key: 'economy',
      text: t('datasetSettings.form.indexMethodEconomy'),
      desc: t('datasetSettings.form.indexMethodEconomyTip'),
      // icon: 'economy'
      icon: 'https://assets.metaio.cc/assets/difyassets/jj.png',
      w: 23,
      h: 18,
    }
  ]

  return (
    <div className={classNames(s.wrapper, 'flex justify-between w-full')}>
      {
        options.map(option => (
          <div
            key={option.key}
            className={classNames(
              option.key === value && s['item-active'],
              s.item,
              itemClass
            )}
            onClick={() => onChange(option.key as DataSet['indexing_technique'])}
            style={option.key === value ? { border: "1px solid #181A24" } : {}}
          >
            <div className='flex items-center mb-1'>
              {/* <div className={classNames(s.icon, s[`${option.icon}-icon`])} /> */}
              <div className='mr-3' style={{ width: 24, height: 24, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                <img src={option.icon} style={{ width: option.w, height: option.h }} />
              </div>
              <div className='grow text-sm text-gray-900'>{option.text}</div>
              {/* <div className={classNames(radioClass, s.radio)} /> */}
            </div>
            <div className='pl-9 text-xs text-gray-500 leading-[18px]'>{option.desc}</div>
          </div>
        ))
      }
    </div>
  )
}

export default IndexMethodRadio
