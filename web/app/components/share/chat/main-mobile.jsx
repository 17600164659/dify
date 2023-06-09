import React from 'react'
import './main-mobile-style.css'

export default ({ sessionList }) => {
    return (
        <div className='main-container'>
            <img className='main-bg' src="https://assets.metaio.cc/assets/difyassets/main-bg.png" />
            <div className='main-header'>
                <img className='main-logo' src='https://assets.metaio.cc/assets/difyassets/main-logo.png' />
                <img className='main-share' src='https://assets.metaio.cc/assets/difyassets/share.png' />
            </div>
            <div className='main-app-list'>
                {
                    // sessionList.sort((a, b) => a.created_at - b.created_at).map(item => (
                    sessionList.sort((a, b) => a.created_at - b.created_at).map(item => {
                        const timer = new Date(parseInt(`${item.created_at}000`));
                        return (
                            <div className='main-chat' key={item.id}>
                                <img className='main-chat-head' src="https://assets.metaio.cc/assets/difyassets/logo.png" />
                                <div className='main-chat-info'>
                                    <p className='main-chat-info-title'>{item.name}</p>
                                    <p className='main-chat-info-discrption'>
                                        {`${timer.getFullYear()}-${timer.getMinutes() + 1}-${timer.getDate()}`}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className='main-footer'>

            </div>
        </div>
    )
}