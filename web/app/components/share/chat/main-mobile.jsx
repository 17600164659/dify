import React, { useEffect, useState } from 'react'
import { fetchConversations } from '@/service/share'
import './main-mobile-style.css'
import { roles } from './constants';

export default () => {
    const [allConversations, setAllConversations] = useState([]);
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
            </div>
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