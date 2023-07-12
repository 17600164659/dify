'use client'
import type { FC } from 'react'
import React from 'react'
import { useContext } from 'use-context-selector'
import produce from 'immer'
import DatasetConfig from '../dataset-config'
import ChatGroup from '../features/chat-group'
import ExperienceEnchanceGroup from '../features/experience-enchance-group'
import Toolbox from '../toolbox'
import AddFeatureBtn from './feature/add-feature-btn'
import AutomaticBtn from './automatic/automatic-btn'
import type { AutomaticRes } from './automatic/get-automatic-res'
import GetAutomaticResModal from './automatic/get-automatic-res'
import ChooseFeature from './feature/choose-feature'
import useFeature from './feature/use-feature'
import ConfigContext from '@/context/debug-configuration'
import ConfigPrompt from '@/app/components/app/configuration/config-prompt'
import ConfigVar from '@/app/components/app/configuration/config-var'
import type { PromptVariable } from '@/models/debug'
import { AppType } from '@/types/app'
import { useBoolean } from 'ahooks'
import "./style.css";

const strategyConfigs = [
  { text: '链上查询策略', icon: 'https://assets.metaio.cc/assets/difyassets/cl/cx.png', color: '#E6C977' },
  { text: '链上探询模型', icon: 'https://assets.metaio.cc/assets/difyassets/cl/tx.png', color: '#D95356' },
  { text: '趋势洞察策略', icon: 'https://assets.metaio.cc/assets/difyassets/cl/dc.png', color: '#9DC174' },
  { text: '指数聚焦统计', icon: 'https://assets.metaio.cc/assets/difyassets/cl/jj.png', color: '#00A3FE' },
  { text: '社踪探索策略', icon: 'https://assets.metaio.cc/assets/difyassets/cl/ts.png', color: '#4152A4' },
];

const Config: FC = () => {
  const {
    mode,
    introduction,
    setIntroduction,
    modelConfig,
    setModelConfig,
    setPrevPromptConfig,
    setFormattingChanged,
    moreLikeThisConfig,
    setMoreLikeThisConfig,
    suggestedQuestionsAfterAnswerConfig,
    setSuggestedQuestionsAfterAnswerConfig,
  } = useContext(ConfigContext)
  const isChatApp = mode === AppType.chat

  const promptTemplate = modelConfig.configs.prompt_template
  const promptVariables = modelConfig.configs.prompt_variables
  const handlePromptChange = (newTemplate: string, newVariables: PromptVariable[]) => {
    const newModelConfig = produce(modelConfig, (draft) => {
      draft.configs.prompt_template = newTemplate
      draft.configs.prompt_variables = [...draft.configs.prompt_variables, ...newVariables]
    })

    if (modelConfig.configs.prompt_template !== newTemplate)
      setFormattingChanged(true)

    setPrevPromptConfig(modelConfig.configs)
    setModelConfig(newModelConfig)
  }

  const handlePromptVariablesNameChange = (newVariables: PromptVariable[]) => {
    setPrevPromptConfig(modelConfig.configs)
    const newModelConfig = produce(modelConfig, (draft) => {
      draft.configs.prompt_variables = newVariables
    })
    setModelConfig(newModelConfig)
  }

  const [showChooseFeature, {
    setTrue: showChooseFeatureTrue,
    setFalse: showChooseFeatureFalse,
  }] = useBoolean(false)
  const { featureConfig, handleFeatureChange } = useFeature({
    introduction,
    setIntroduction,
    moreLikeThis: moreLikeThisConfig.enabled,
    setMoreLikeThis: (value) => {
      setMoreLikeThisConfig(produce(moreLikeThisConfig, (draft) => {
        draft.enabled = value
      }))
    },
    suggestedQuestionsAfterAnswer: suggestedQuestionsAfterAnswerConfig.enabled,
    setSuggestedQuestionsAfterAnswer: (value) => {
      setSuggestedQuestionsAfterAnswerConfig(produce(suggestedQuestionsAfterAnswerConfig, (draft) => {
        draft.enabled = value
      }))
    },
  })

  const hasChatConfig = isChatApp && (featureConfig.openingStatement || featureConfig.suggestedQuestionsAfterAnswer)
  const hasToolbox = false

  const [showAutomatic, { setTrue: showAutomaticTrue, setFalse: showAutomaticFalse }] = useBoolean(false)
  const handleAutomaticRes = (res: AutomaticRes) => {
    const newModelConfig = produce(modelConfig, (draft) => {
      draft.configs.prompt_template = res.prompt
      draft.configs.prompt_variables = res.variables.map(key => ({ key, name: key, type: 'string', required: true }))
    })
    setModelConfig(newModelConfig)
    setPrevPromptConfig(modelConfig.configs)
    if (mode === AppType.chat)
      setIntroduction(res.opening_statement)
    showAutomaticFalse()
  }
  return (
    <>
      <div className="pb-[20px]">
        <div className='flex justify-between items-center mb-4' style={{ position: 'absolute', top: 28 }}>
          <AddFeatureBtn onClick={showChooseFeatureTrue} />
          {/* <AutomaticBtn onClick={showAutomaticTrue} /> */}
        </div>

        {showChooseFeature && (
          <ChooseFeature
            isShow={showChooseFeature}
            onClose={showChooseFeatureFalse}
            isChatApp={isChatApp}
            config={featureConfig}
            onChange={handleFeatureChange}
          />
        )}
        {showAutomatic && (
          <GetAutomaticResModal
            mode={mode as AppType}
            isShow={showAutomatic}
            onClose={showAutomaticFalse}
            onFinished={handleAutomaticRes}
          />
        )}
        {/* Template */}
        <ConfigPrompt
          mode={mode as AppType}
          promptTemplate={promptTemplate}
          promptVariables={promptVariables}
          onChange={handlePromptChange}
        />

        <div className='app-info-strategy'>
          <div className='app-info-strategy-title'>
            <img src="https://assets.metaio.cc/assets/difyassets/cl.png" width={14} height={14} style={{ height: 14, position: 'relative', top: 7 }} />
            策略
          </div>
          <div className='app-info-strategy-list'>
            {
              strategyConfigs.map((item) => (
                <div className='app-info-strategy-list-item'>
                  <img className='app-info-strategy-list-item-icon' src={item.icon} />
                  <div className='app-info-strategy-list-item-text'>{item.text}</div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Variables */}
        <ConfigVar
          promptVariables={promptVariables}
          onPromptVariablesChange={handlePromptVariablesNameChange}
        />

        {/* Dataset */}
        <DatasetConfig />

        {/* ChatConifig */}
        {
          hasChatConfig && (
            <ChatGroup
              isShowOpeningStatement={featureConfig.openingStatement}
              openingStatementConfig={
                {
                  value: introduction,
                  onChange: setIntroduction,
                }
              }
              isShowSuggestedQuestionsAfterAnswer={featureConfig.suggestedQuestionsAfterAnswer}
            />
          )
        }

        {/* TextnGeneration config */}
        {moreLikeThisConfig.enabled && (
          <ExperienceEnchanceGroup />
        )}

        {/* Toolbox */}
        {
          hasToolbox && (
            <Toolbox searchToolConfig={false} sensitiveWordAvoidanceConifg={false} />
          )
        }
      </div>
    </>
  )
}
export default React.memo(Config)
