'use client'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import s from './index.module.css'
import { DataSet } from '@/models/datasets'
import './style.css';

const itemClass = `
  flex items-center w-[234px] h-12 px-3 rounded-xl bg-gray-25 border border-gray-100 cursor-pointer
`
const radioClass = `
  w-4 h-4 border-[2px] border-gray-200 rounded-full
`
type IPermissionsRadioProps = {
  value?: DataSet['permission']
  onChange: (v?: DataSet['permission']) => void
}

const PermissionsRadio = ({
  value,
  onChange
}: IPermissionsRadioProps) => {
  const { t } = useTranslation()
  const options = [
    {
      key: 'only_me',
      text: t('datasetSettings.form.permissionsOnlyMe'),
      icon: "https://assets.metaio.cc/assets/difyassets/zyw.png",
    },
    {
      key: 'all_team_members',
      text: t('datasetSettings.form.permissionsAllMember'),
      icon: "https://assets.metaio.cc/assets/difyassets/sycy.png",
    }
  ]

  return (
    <div className={classNames(s.wrapper, 'flex justify-between w-full')}>
      {
        options.map(option => (
          <div
            key={option.key}
            className={classNames(
              option.key === value && s['custom-cansee-active'],
              itemClass,
              s.item,
              'custom-cansee-select'
            )}
            onClick={() => onChange(option.key as DataSet['permission'])}
            style={option.key === value ? { border: "1px solid #181A24" } : {}}
          >
            <div className='custom-cansee-select-icon'>
              <img src={option.icon} style={{ width: 24, height: 24 }} />
            </div>
            {/* <div className={classNames(s['user-icon'], 'mr-3')} style={{ background: "url(https://assets.metaio.cc/assets/difyassets/td.png)" }} /> */}
            <div className='grow text-sm text-gray-900'>{option.text}</div>
            {/* <div className={classNames(radioClass, s.radio)} /> */}
          </div>
        ))
      }
    </div>
  )
}

export default PermissionsRadio
