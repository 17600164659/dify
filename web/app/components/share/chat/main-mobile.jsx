import React from 'react'
import './main-mobile-style.css'


const mock = [1, 2, 3, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
export default () => {
    return (
        <div className='main-container'>
            <img className='main-bg' src="https://assets.metaio.cc/assets/difyassets/main-bg.png" />
            <div className='main-header'>
                <img className='main-logo' src='https://assets.metaio.cc/assets/difyassets/main-logo.png' />
                <img className='main-share' src='https://assets.metaio.cc/assets/difyassets/share.png' />
            </div>
            <div className='main-app-list'>
                {
                    mock.map(item => (
                        <div className='main-chat' key={item}>
                            <img className='main-chat-head' src="https://assets.metaio.cc/assets/difyassets/logo.png" />
                            <div className='main-chat-info'>
                                <p className='main-chat-info-title'>name</p>
                                <p className='main-chat-info-discrption'>discrption</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='main-footer'>

            </div>
        </div>
    )
}