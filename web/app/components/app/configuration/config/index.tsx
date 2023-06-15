'use client'
import type { FC } from 'react'
import React from 'react'
import { useContext } from 'use-context-selector'
import produce from 'immer'
import AddFeatureBtn from './feature/add-feature-btn'
import ChooseFeature from './feature/choose-feature'
import useFeature from './feature/use-feature'
import ConfigContext from '@/context/debug-configuration'
import DatasetConfig from '../dataset-config'
import ChatGroup from '../features/chat-group'
import ExperienceEnchanceGroup from '../features/experience-enchance-group'
import Toolbox from '../toolbox'
import ConfigPrompt from '@/app/components/app/configuration/config-prompt'
import ConfigVar from '@/app/components/app/configuration/config-var'
import type { PromptVariable } from '@/models/debug'
import { AppType } from '@/types/app'
import { useBoolean } from 'ahooks'
import "./style.css";

const strategyConfigs = [
  { text: '链上查询策略', color: '#E6C977' },
  { text: '链上探询模型', color: '#D95356' },
  { text: '趋势洞察策略', color: '#9DC174' },
  { text: '指数聚焦统计', color: '#00A3FE' },
  { text: '社踪探索策略', color: '#4152A4' },
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
    moreLikeThisConifg,
    setMoreLikeThisConifg,
    suggestedQuestionsAfterAnswerConfig,
    setSuggestedQuestionsAfterAnswerConfig
  } = useContext(ConfigContext)
  const isChatApp = mode === AppType.chat

  const promptTemplate = modelConfig.configs.prompt_template
  const promptVariables = modelConfig.configs.prompt_variables
  const handlePromptChange = (newTemplate: string, newVariables: PromptVariable[]) => {
    const newModelConfig = produce(modelConfig, (draft) => {
      draft.configs.prompt_template = newTemplate
      draft.configs.prompt_variables = [...draft.configs.prompt_variables, ...newVariables]
    })

    if (modelConfig.configs.prompt_template !== newTemplate) {
      setFormattingChanged(true)
    }

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
    setFalse: showChooseFeatureFalse
  }] = useBoolean(false)
  const { featureConfig, handleFeatureChange } = useFeature({
    introduction,
    setIntroduction,
    moreLikeThis: moreLikeThisConifg.enabled,
    setMoreLikeThis: (value) => {
      setMoreLikeThisConifg(produce(moreLikeThisConifg, (draft) => {
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

  return (
    <>
      <div className="pb-[20px]">
        <div className='flex justify-between items-center mb-4' style={{ position: 'absolute', top: 28 }}>
          <AddFeatureBtn onClick={showChooseFeatureTrue} />
          <div>
            {/* AutoMatic */}
          </div>
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
                  <div style={{ background: item.color }} className='app-info-strategy-list-item-icon'></div>
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
                  promptTemplate,
                  value: introduction,
                  onChange: setIntroduction
                }
              }
              isShowSuggestedQuestionsAfterAnswer={featureConfig.suggestedQuestionsAfterAnswer}
            />
          )
        }

        {/* TextnGeneration config */}
        {moreLikeThisConifg.enabled && (
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
