import React, { useEffect, useState } from 'react'
import { fetchConversations } from '@/service/share'
import './main-mobile-style.css'
import { roles } from './constants';

export default () => {
    const [allConversations, setAllConversations] = useState([]);
    const [contentType, setContentType] = useState('chat');
    const toRole = (id) => {
        window.location.href = `${window.location.origin}/chat/${id}?is_share=true&is_new=true`;
    }

    const onSelect = (appId, id) => {
        window.location.href = `${window.location.origin}/chat/${appId}?is_share=true&conversation=${id}`;
    }

    const getConversations = async () => {
        const requests = [];
        roles.forEach(item => {
            requests.push({
                promise: fetchConversations(false, undefined, '', item.id),
                appId: item.id,
                icon: item.icon,
            });
        });

        const conversations = await Promise.all(requests.map(item => item.promise));
        let result = [];
        requests.map((request, index) => {
            const conver = conversations[index];
            conver.data.map(item => {
                item.appId = request.appId;
                item.icon = request.icon;
            })
            result = result.concat(conver.data);
        })
        setAllConversations(result);
    }

    useEffect(() => {
        getConversations();
    }, [])
    return (
        <div className='main-container'>
            <img className='main-bg' src="https://assets.metaio.cc/assets/difyassets/main-bg.png" />
            <div className='main-header'>
                <img className='main-logo' src='https://assets.metaio.cc/assets/difyassets/main-logo.png' />
                {/* <img className='main-share' src='https://assets.metaio.cc/assets/difyassets/share.png' /> */}
                <div className='main-menu'>
                    <div className='main-menu-item' onClick={() => setContentType('chat')}><img src="https://assets.metaio.cc/assets/difyassets/main-dh.png" />对话</div>
                    <div className='main-menu-line'></div>
                    <div className='main-menu-item' onClick={() => setContentType('news')}><img src="https://assets.metaio.cc/assets/difyassets/main-yw.png" />要闻</div>
                </div>
            </div>
            {
                contentType === 'chat' ? (
                    <div className='main-app-list'>
                        {
                            // sessionList.sort((a, b) => a.created_at - b.created_at).map(item => (
                            allConversations.sort((a, b) => b.created_at - a.created_at).map(item => {
                                const timer = new Date(parseInt(`${item.created_at}000`));
                                return (
                                    <div className='main-chat' key={item.id} onClick={() => onSelect(item.appId, item.id)}>
                                        <img className='main-chat-head' src={item.icon} />
                                        <div className='main-chat-info'>
                                            <p className='main-chat-info-title'>{item.name}</p>
                                            <p className='main-chat-info-discrption'>
                                                {`${timer.getFullYear()}-${timer.getMonth() + 1}-${timer.getDate()} ${timer.getHours()}:${timer.getMinutes()}`}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : (
                    <div className='main-app-news'>
                        {/* <div className='main-app-datas'>
                            <div className='main-app-datas-content'>
                                <div></div>
                            </div>
                        </div> */}
                        <div className='main-app-news-list'>
                            <div className='main-app-news-item'>
                                <div className='main-app-news-item-head'>
                                    <img src="https://assets.metaio.cc/assets/difyassets/logo.png" width={34} height={34} />
                                    小耳朵
                                </div>
                                <div className='main-app-news-item-content'>比特币昨日整体波动不大，凌晨受消息面影响行情加速下跌，最低至24800一线支撑反弹。<br />
                                    四小时级别空头发力加速下跌，macd放量运行双线死叉向下指引，ma均线向下指引，目前行情虽然止跌但反弹力度偏弱，预计短期将持续震荡修复。</div>
                                <div className='main-app-news-item-links'>
                                    <div className='main-app-news-item-links-title'><img src="https://assets.metaio.cc/assets/difyassets/main-xwly.png" />新闻来源</div>
                                    {/* <div className='main-app-news-item-links-content'> */}
                                    <a className='main-app-news-item-links-item'>
                                        ·Devin
                                    </a>
                                    <a className='main-app-news-item-links-item'>
                                        ·Harriet
                                    </a>
                                    <a className='main-app-news-item-links-item'>
                                        ·Andy
                                    </a>
                                    {/* </div> */}
                                </div>
                                <div className='main-app-news-item-time'>
                                    <img width={12} height={12} src="https://assets.metaio.cc/assets/difyassets/main-sj.png" />2023.06.06
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <div className='main-footer'>
                <div style={{ width: (98 * roles.length) + (8 * (roles.length - 1)) + 40 }}>
                    {
                        roles.map((item, index) => (
                            <div onClick={() => toRole(item.id)} className="main-roles" key={item.id} style={index === 0 ? { marginLeft: 20 } : index === roles.length - 1 ? { marginRight: 20 } : {}}>
                                <img className='main-roles-header' src={item.icon} width={16} height={16} />
                                <span className='main-roles-name'>{item.name}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}