import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Input } from 'antd';
import Panel from '../base/feature-panel'
import VarIcon from '../base/icons/var-icon'
import Tooltip from '@/app/components/base/tooltip'
import OperationBtn from '../base/operation-btn'

import {
    getTeams,
    getApps,
    getModules,
    getModuleDetails,
    getAllPlugins,
} from '@/service/wemo'

import s from './index.module.css';
import './styles.css';

import edite from './assets/edite.png';
import deletePic from './assets/delete.png';
import add from './assets/add.png';

const mock = [1, 2, 3, 4, 5];

let id = 1;
let inited = false;

const ConfigPlugn = ({ defaultStrategy, saveStrategy }) => {
    // ========================= STATES =========================
    const [plugins, setPlugins] = useState([]);
    const [showPlugins, setShowPlugins] = useState([]);
    const [strategy, setStrategy] = useState(defaultStrategy || []);
    const [currentStrategy, setCurrentStrategy] = useState("");
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [visibleConfig, setVisibleConfig] = useState(false);
    const [currentPluginConfig, setCurrentPluginConfig] = useState(null);

    const setStrategyHandle = (data) => {
        setStrategy(data);
        saveStrategy(data);
    }

    // ========================= HANDLES =========================
    const getPlugins = async () => {
        const allPlugins = await getAllPlugins();
        setShowPlugins(JSON.parse(JSON.stringify(allPlugins)));
        setPlugins(allPlugins);
    }

    const addStrategy = () => {
        const newStrategy = {
            id: `${id}`,
            name: `策略${strategy.length + 1}`,
            prompt: '',
            plugins: [],
            disabledName: true,
        }
        setStrategyHandle([...strategy, newStrategy]);
    }

    const deleteStrategy = (item, index) => {
        const newStrategy = [...strategy];
        newStrategy.splice(index, 1);
        setStrategyHandle(newStrategy);
    }

    const editeStrategyName = (item, index) => {
        item.disabledName = !item.disabledName;
        setStrategyHandle([...strategy]);
    }

    const changeStrategyName = (e, item) => {
        item.name = e.target.value;
        setStrategyHandle([...strategy]);
    }

    const addPluginByStrategy = (item, index) => {
        setCurrentStrategy(item.id);
        setTimeout(() => {
            setVisible(true);
            setLoading(true);
        })
    }

    const handleOk = () => {
        const selectedPlugins = showPlugins.filter(item => item.selected);
        const current = strategy.find(item => item.id === currentStrategy);
        console.log(currentStrategy, 23232323)
        if (current) {
            current.plugins = selectedPlugins;
        }
        setStrategyHandle([...strategy]);
        setVisible(false);
    };
    const handleCancel = () => setVisible(false);

    const selectPlugin = (item) => {
        item.selected = !item.selected;
        setShowPlugins([...showPlugins]);
    }

    const promptOnChange = (e, item) => {
        item.prompt = e.target.value;
        setStrategyHandle([...strategy]);
    }

    const configPlugin = (plugin) => {
        setCurrentPluginConfig(plugin);
        setVisibleConfig(true);
    }

    const handlePluginOk = () => {
        setCurrentPluginConfig(null);
        setVisibleConfig(false);
        setStrategy([...strategy]);
    }

    const handlePluginCancel = () => setVisibleConfig(false);

    const handlePluginPropertysChange = (e, property) => {
        const value = e.target.value;
        property.value = value;
        setCurrentPluginConfig({ ...currentPluginConfig });
    }

    const handleUseUserInput = (property) => {
        property.useUserInput = !property.useUserInput;
        setCurrentPluginConfig({ ...currentPluginConfig });
    }

    // ========================= EFFECTS =========================

    useEffect(() => {
        const wemo_user = window.localStorage.getItem('wemo_user')
        if (wemo_user) {
            getPlugins();
        }
        return () => {
            inited = false;
        }
    }, [])

    useEffect(() => {
        if (defaultStrategy.length && !inited) {
            setStrategy(defaultStrategy)
            inited = true;
            id = defaultStrategy.length + 1;
        }
    }, [defaultStrategy])

    // ========================= RENDER =========================

    return (
        <>
            <Panel
                className="mt-4"
                headerIcon={
                    <img src="https://assets.metaio.cc/assets/difyassets/cl.png" width={14} height={14} style={{ height: 14, position: 'relative' }} />
                }
                title={
                    <div className='flex items-center gap-2'>
                        <div>策略</div>
                        <a style={{ color: "black" }} href='http://admin.wemoai.com/#/app/list' target="_blank">插件管理</a>
                        {/* <Tooltip content="撒打算大" selector='config-var-tooltip'>
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.66667 11.1667H8V8.5H7.33333M8 5.83333H8.00667M14 8.5C14 9.28793 13.8448 10.0681 13.5433 10.7961C13.2417 11.5241 12.7998 12.1855 12.2426 12.7426C11.6855 13.2998 11.0241 13.7417 10.2961 14.0433C9.56815 14.3448 8.78793 14.5 8 14.5C7.21207 14.5 6.43185 14.3448 5.7039 14.0433C4.97595 13.7417 4.31451 13.2998 3.75736 12.7426C3.20021 12.1855 2.75825 11.5241 2.45672 10.7961C2.15519 10.0681 2 9.28793 2 8.5C2 6.9087 2.63214 5.38258 3.75736 4.25736C4.88258 3.13214 6.4087 2.5 8 2.5C9.5913 2.5 11.1174 3.13214 12.2426 4.25736C13.3679 5.38258 14 6.9087 14 8.5Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Tooltip> */}
                    </div>
                }
                headerRight={<OperationBtn type="add" onClick={addStrategy} />}
            >
                {!strategy.length && <div className='text-xs text-gray-500'>策略能使AI根据指定场景调度插件应用，以获得更精准的数据回答用户问题。</div>}
                {
                    strategy.map((item, index) => (
                        <div className={s.Plugin} key={item.name + index}>
                            <div className={s.PluginTitleLayout}>
                                <input
                                    disabled={item.disabledName}
                                    className={s.PluginTitle}
                                    onBlur={(e) => changeStrategyName(e, item)}
                                    defaultValue={item.name}
                                />
                                <div className={s.PluginTitleEditor}>
                                    <img src={edite.src} onClick={() => editeStrategyName(item, index)} />
                                    <div className={s.PluginTitleCertical} />
                                    <img src={deletePic.src} onClick={() => deleteStrategy(item, index)} />
                                </div>
                            </div>
                            <textarea defaultValue={item.prompt} onChange={e => promptOnChange(e, item)} className={s.PluginTextArea + ' text-xs'} placeholder='撰写提示词，AI会根据提示词要求调度插件。例：当我需要联网查询数据时，调用此插件。提示词越详细和精准越好。' />
                            <div className={s.PluginListContainer}>
                                {
                                    item.plugins.map(plugin => (
                                        <div key={plugin.moduleId} className={s.PluginListItem} onClick={() => configPlugin(plugin)}>
                                            <div className={s.PluginItemIcon}>{plugin.name.slice(0, 1)}</div>
                                            <span>{plugin.name}</span>
                                        </div>
                                    ))
                                }
                                <div
                                    onClick={() => addPluginByStrategy(item, index)}
                                    className={s.PluginListItem}
                                >
                                    <img src={add.src} className={s.PluginListItemPic} /><span>添加插件</span>
                                </div>
                            </div>
                        </div>
                    ))
                }

            </Panel>
            <Modal
                destroyOnClose
                width={668}
                title="插件市场"
                open={visible}
                onCancel={handleCancel}
                footer={<div>
                    <Button
                        style={{ borderRadius: 1000, background: 'black', color: 'white', width: 124 }}
                        onClick={handleOk}
                    >
                        确认
                    </Button>
                </div>}
            >
                <div className={s.PluginMarket}>
                    {
                        showPlugins.length ? showPlugins.map(item => (
                            <div
                                className={`${s.PluginMarketItem} ${item.selected ? s.PluginMarketItemSelected : ''}`}
                                key={item.moduleId}
                                onClick={() => selectPlugin(item)}
                            >
                                {/* <img className={s.PluginMarketIcon} /> */}
                                <span className={s.PluginMarketIcon}>{item.name.slice(0, 1)}</span>
                                <div className={s.PluginMarketInfo}>
                                    <div className={s.PluginMarketTitle}>{item.name}</div>
                                    <div className={s.PluginMarketDescribe}>{item.description || "插件详情未填写"}</div>
                                </div>
                            </div>
                        )) : (
                            <div>
                                您还没有可用的插件，去<a style={{ color: "black", fontWeight: 600 }} href='http://admin.wemoai.com/#/app/list' target="_blank">插件中心</a>查看并创建插件
                            </div>
                        )
                    }
                </div>
            </Modal>
            <Modal
                open={visibleConfig}
                onCancel={handlePluginCancel}
                footer={<div>
                    <Button
                        style={{ borderRadius: 1000, background: 'black', color: 'white', width: 124 }}
                        onClick={handlePluginOk}
                    >
                        确认
                    </Button>
                </div>}
            >
                <div className={s.PluginConfigTitle}>插件配置</div>
                {
                    currentPluginConfig && currentPluginConfig.input.properties.length && currentPluginConfig.input.properties.map(property => (
                        <div className={s.PluginConfig}>
                            <div className={s.PluginConfigLabel}>{property.displayName}</div>
                            <div className={s.PluginConfigContainer}>
                                <Input value={property.value || ""} disabled={property.useUserInput} onChange={v => handlePluginPropertysChange(v, property)} className={s.PluginConfigInput} />
                                <Button onClick={() => handleUseUserInput(property)} className={s.PluginConfigBtn}>使用用户输入</Button>
                            </div>
                        </div>
                    ))
                }
            </Modal>
        </>
    )
}

export default React.memo(ConfigPlugn)