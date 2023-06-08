import React from 'react'
import './main-mobile-style.css'

export default () => {
    return (
        <div className='main-container'>
            <img className='main-bg' src="https://assets.metaio.cc/assets/difyassets/main-bg.png" />
            <div className='main-header'>
                <img className='main-logo' src='https://assets.metaio.cc/assets/difyassets/main-logo.png' />
                <img className='main-share' src='https://assets.metaio.cc/assets/difyassets/share.png' />
            </div>
            <div className='main-app-list'>
                <div className='main-chat'>
                    <img />
                    <div>
                        <p></p>
                        <p></p>
                    </div>
                </div>
            </div>
            <div className='main-footer'></div>
        </div>
    )
}