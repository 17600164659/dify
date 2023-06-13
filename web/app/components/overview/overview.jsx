import React from 'react'
import './overview.css';

export default (props) => {
    return (
        <div className='overview-container'>
            <div className='app-overview'>
                <p className='overview-title'>应用统计</p>
                <div>
                    <div className='app-overview-list app-overview-list-item-mb'>
                        <div className='app-overview-list-item app-overview-list-item-mr'>
                            <div className='app-overview-list-item-icon'><img src="https://assets.metaio.cc/assets/difyassets/yyzs.png" /></div>
                            <div className='app-overview-list-item-contents'>
                                <p className='app-overview-list-item-title'>应用总数</p>
                                <p className='app-overview-list-item-deascription'>999</p>
                            </div>
                        </div>
                        <div className='app-overview-list-item'>
                            <div className='app-overview-list-item-icon'><img src="https://assets.metaio.cc/assets/difyassets/jrgx.png" /></div>
                            <div className='app-overview-list-item-contents'>
                                <p className='app-overview-list-item-title'>今日更新</p>
                                <p className='app-overview-list-item-deascription'>999</p>
                            </div>
                        </div>
                    </div>
                    <div className='app-overview-list'>
                        <div className='app-overview-list-item app-overview-list-item-mr'>
                            <div className='app-overview-list-item-icon'><img src="https://assets.metaio.cc/assets/difyassets/bf.png" /></div>
                            <div className='app-overview-list-item-contents'>
                                <p className='app-overview-list-item-title'>开发中</p>
                                <p className='app-overview-list-item-deascription'>999</p>
                            </div>
                        </div>
                        <div className='app-overview-list-item'>
                            <div className='app-overview-list-item-icon'><img className='https://assets.metaio.cc/assets/difyassets/sjjs.png' /></div>
                            <div className='app-overview-list-item-contents'>
                                <p className='app-overview-list-item-title'>开发中</p>
                                <p className='app-overview-list-item-deascription'>999</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='user-overview'>
                <p className='overview-title'>应用统计</p>
                <div className='user-overview-list'>
                    <div className='user-overview-list-item'>
                        <div className='user-overview-list-item-icon'><img src="https://assets.metaio.cc/assets/difyassets/databases.png" /></div>
                        <div className='user-overview-list-item-name'>开发中</div>
                        <div className='user-overview-list-item-num'>999</div>
                    </div>
                    <div className='user-overview-list-item'>
                        <div className='user-overview-list-item-icon'><img src="https://assets.metaio.cc/assets/difyassets/upload.png" /></div>
                        <div className='user-overview-list-item-name'>开发中</div>
                        <div className='user-overview-list-item-num'>999</div>
                    </div>
                    <div className='user-overview-list-item'>
                        <div className='user-overview-list-item-icon'><img src="https://assets.metaio.cc/assets/difyassets/link.png" /></div>
                        <div className='user-overview-list-item-name'>开发中</div>
                        <div className='user-overview-list-item-num'>999</div>
                    </div>
                </div>
            </div>
            <div className='data-overview'>
                <p className='overview-title'>应用统计</p>
                <img src="https://assets.metaio.cc/assets/difyassets/chart.png" className='data-overview-chart' />
            </div>
        </div>
    )
}