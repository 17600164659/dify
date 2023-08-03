'use client'
import React, { useEffect, useState } from 'react';
import { Empty, Upload, Button, message, Drawer, Input, Modal } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import UploadProps from './uploadHelper';
import './index.css';
import r from '@/utils/request';

const request = r('chain.metaio.cc');
const { TextArea } = Input;
let waitDeleteArcitle = null;
export default ({ appId }) => {
    // ========================= STATE =========================
    const [visible, setVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentArticle, setCurrentArticle] = useState({});
    const [articles, setArticles] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);


    // ========================= HANDLE =========================
    const getArticle = async () => {
        try {
            const result = await request.post('/wobi/article/all');
            if (result.data.code === 200 && result.data.data) {
                result.data.data.forEach(item => {
                    item.aid = item.ArticleId;
                })
                setArticles(result.data.data);
            }
        } catch (e) {
            message.open({
                type: 'error',
                content: e.message,
            });
        }
    }

    const showDetail = (article) => {
        console.log(article, 2323232323)
        setCurrentArticle(article)
        setVisible(true)
    }
    const newArticle = () => {
        setCurrentArticle({});
        setVisible(true)
    }

    const addParagraph = () => {
        const newCurrentArticle = { ...currentArticle };
        const newParagraph = [...(currentArticle.paragraph || []), {}];
        newCurrentArticle.paragraph = newParagraph;
        setCurrentArticle(newCurrentArticle);
    }

    const paragraphItemChange = (item, v, key) => {
        item[key] = v.target.value;
        setCurrentArticle({ ...currentArticle });
    }

    const articleTitleChange = (v) => {
        setCurrentArticle({ ...currentArticle, articleTitle: v.target.value });
    }

    const articleInfoChange = (v) => {
        setCurrentArticle({ ...currentArticle, articleInfo: v.target.value });
    }

    const linkChange = v => {
        setCurrentArticle({ ...currentArticle, link: v.target.value });
    }

    const onUploadedPic = (v) => {
        currentArticle.imageUrl = v.url;
        setCurrentArticle({ ...currentArticle });
    }

    const onUploadedItemPic = (index) => (v) => {
        const currentParagraph = currentArticle.paragraph[index];
        currentParagraph.pic = v.url;
        setCurrentArticle({ ...currentArticle });
    }

    const submitArticle = async () => {
        try {
            const result = await request.post('/wobi/article/save', { ...currentArticle })
            if (result.data.code === 200) {
                setVisible(false);
                getArticle();
            } else {
                throw new Error(result.data.msg)
            }
        } catch (e) {
            message.open({
                type: 'error',
                content: e.message,
            });
        }
    }

    const deleteArticle = async (item, e) => {
        waitDeleteArcitle = item;
        e.stopPropagation()
        setModalVisible(true)
        return false;
    }

    const confirmDeleteArticle = async () => {
        try {
            const result = await request.post('/wobi/article/delete', { aid: waitDeleteArcitle.aid })
            if (result.data.code === 200) {
                getArticle();
            } else {
                throw new Error(result.data.msg);
            }
        } catch (e) {
            setModalVisible(false);
            message.open({
                type: 'error',
                content: e.message,
            });
        }
    }

    // ========================= EFFECT =========================
    useEffect(() => {
        getArticle();
    }, [])

    // ========================= COMPONENT =========================
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    // ========================= RENDER =========================
    return (
        <>
            <div className='Article'>
                <div className='Article-main-title'>
                    内容列表
                    <Button onClick={newArticle} style={{ borderRadius: 1000, background: 'black', color: 'white', float: 'right', marginRight: 20 }}>添加内容</Button>
                </div>
                <div className='Article-content'>
                    {
                        articles.length ? articles.map(item => (
                            <div className='Article-item' onClick={() => showDetail(item)}>
                                <div className='Article-pic-container'>
                                    <img className='Article-pic' src={item.imageUrl} />
                                </div>
                                <div className='Article-detail'>
                                    <div className="Article-title">{item.articleTitle}</div>
                                    <div className='Article-summary'>&nbsp;&nbsp;&nbsp;&nbsp;{item.articleInfo}</div>
                                    <div className='Article-edit'>
                                        {/* <div className='Article-edit-item Article-edit-up'><img src="https://assets.metaio.cc/assets/difyassets/wobi-up.png" />置顶</div> */}
                                        <div onClick={(e) => deleteArticle(item, e)} className='Article-edit-item Article-edit-delete'><img src="https://assets.metaio.cc/assets/difyassets/wobi-delete.png" />删除</div>
                                    </div>
                                </div>
                            </div>
                        )) : <Empty style={{ marginTop: 160 }} description="暂无内容" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }
                </div>
            </div>
            <Drawer width={800} visible={visible} onClose={() => setVisible(false)}>
                <div className='Article-writer'>
                    <div className='Article-main-title'>
                        内容编辑
                        {/* <Button onClick={submitArticle} style={{ borderRadius: 1000, background: 'black', color: 'white', float: 'right', marginRight: 20 }}>发布</Button> */}
                    </div>
                    <div className='Article-writer-item'>
                        <div className='Article-writer-item-title'><span style={{ color: 'red' }}>*</span>内容标题</div>
                        <Input placeholder='内容标题' value={currentArticle.articleTitle} onChange={articleTitleChange} />
                    </div>
                    <div className='Article-writer-item'>
                        <div className='Article-writer-item-title'><span style={{ color: 'red' }}>*</span>内容简介</div>
                        <Input.TextArea placeholder='内容简介' value={currentArticle.articleInfo} onChange={articleInfoChange} />
                    </div>
                    <div className='Article-writer-item' style={{ display: 'flex' }} >
                        <div style={{ width: 100 }} className='Article-writer-item-title'><span style={{ color: 'red' }}>*</span>内容封面</div>
                        <Upload
                            className="avatar-uploader"
                            listType="picture-card"
                            showUploadList={false}
                            {...UploadProps(onUploadedPic)}
                            accept="image/*"
                        >
                            {currentArticle.imageUrl ? "✅" : uploadButton}
                        </Upload>
                    </div>
                    <div className='Article-writer-item'>
                        <div className='Article-writer-item-title'><span style={{ color: 'red' }}>*</span>公众号文章链接</div>
                        <Input placeholder='公众号文章链接' value={currentArticle.link} onChange={linkChange} />
                    </div>
                    {
                        false && (currentArticle.paragraph || []).map((item, index) => (
                            <div className='Article-writer-item-paragraph'>
                                <div className='Article-writer-item-editor'>
                                    {/* <div className='Article-writer-item-editor-item Article-writer-item-editor-up'><img src="https://assets.metaio.cc/assets/difyassets/wobi-up.png" />编辑</div> */}
                                    <div className='Article-writer-item-editor-item Article-writer-item-editor-delete'><img src="https://assets.metaio.cc/assets/difyassets/wobi-delete.png" />删除</div>
                                </div>
                                <Input placeholder='嘉宾简介:' value={item.title} onChange={v => paragraphItemChange(item, v, 'title')} />
                                <TextArea placeholder='这是一段内容描述，以下省略1000字' value={item.content} onChange={v => paragraphItemChange(item, v, 'content')} />
                                <Upload
                                    className="avatar-uploader"
                                    listType="picture-card"
                                    showUploadList={false}
                                    {...UploadProps(onUploadedItemPic(index))}
                                    accept="image/*,video/mp4"
                                >
                                    {item.pic ? "✅" : uploadButton}
                                </Upload>
                            </div>
                        ))
                    }
                    <div style={{ paddingBottom: 30 }}>
                        <Button
                            style={{ marginBottom: 20, borderRadius: 1000, background: 'black', color: 'white', float: 'left', marginRight: 20 }}
                            // onClick={addParagraph}
                            onClick={submitArticle}
                        >
                            发布
                        </Button>
                    </div>
                </div>
            </Drawer>

            <Modal okType="default" title="Basic Modal" open={modalVisible} onOk={confirmDeleteArticle} onCancel={() => setModalVisible(false)}>
                是否删除文章？
            </Modal>
        </>
    )
}