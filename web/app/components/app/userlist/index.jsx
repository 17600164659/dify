'use client'
import React, { useEffect, useState } from 'react';
import { Button, message, Drawer } from 'antd';
import './index.css';
import r from '@/utils/request';

const request = r('chain.metaio.cc');

const BaseInfo = [
    {
        label: '姓名',
        key: 'name'
    },
    {
        label: '性别',
        key: 'gender'
    },
    {
        label: '出生日期',
        key: 'birthday'
    },
    {
        label: '联系电话',
        key: 'contact'
    },
    {
        label: '手术时间',
        key: 'operationDay'
    },
    {
        label: '过往病史',
        key: 'PastMedicalHistory'
    },
    {
        label: '药物过敏史',
        key: 'DrugAllergyHistory'
    },
]

const PromptData1 = [
    {
        label: "个人病史",
        key: "个人病史",
    },
    {
        label: "康复治疗的方式",
        key: "康复治疗的方式",
    },
    {
        label: "新发卒中症状",
        key: "新发卒中症状",
    },
    {
        label: "生活是否自理",
        key: "生活是否自理",
    },
    {
        label: "用药情况",
        key: "用药情况",
    },
    {
        label: "目前症状",
        key: "目前症状",
    },
    {
        label: "空腹血糖",
        key: "空腹血糖",
    },
    {
        label: "脑卒中并发症情况",
        key: "脑卒中并发症情况",
    },
    {
        label: "脑卒中类型",
        key: "脑卒中类型",
    },
    {
        label: "脑卒中部位",
        key: "脑卒中部位",
    },
    {
        label: "血压",
        key: "血压",
    },
]

export default ({ appId }) => {
    const [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false);
    const [active, setActive] = useState('baseInfo');
    const [currentUser, setCurrentUser] = useState({});
    const [promptData1, setPromptData1] = useState({});
    const [promptData2, setPromptData2] = useState({});
    const getUserList = async () => {
        try {
            const result = await request.post('/wobi/user/all');
            if (result.data.code === 200) {
                const newList = [];
                result.data.data.forEach(item => {
                    const user = JSON.parse(item.baseInfo);
                    user.gender = `${user.gender}` === '1' ? "男" : "女";
                    user.phone = item.phone;
                    user.id = item.UserId;

                    const date = new Date(item.createAt);
                    const month = `${date.getMonth() + 1}`;
                    const day = `${date.getDate()}`;

                    const HH = `${date.getHours()}`
                    const MM = `${date.getMinutes()}`;

                    user.createAt = `${date.getFullYear()}-${month.length === 1 ? '0' + month : month}-${day.length === 1 ? '0' + day : day} ${HH.length === 1 ? '0' + HH : HH}:${MM.length === 1 ? '0' + MM : MM}`;
                    newList.push(user);
                })
                setUsers(newList);
                return;
            }
            console.log(result.data.msg)
        } catch (e) {
            console.log(e)
        }
    }

    const getPromptData = async (user) => {
        try {
            const result1 = await request.post('/wobi/user/getPromptData', { uid: `${user.id}-1` });
            const result2 = await request.post('/wobi/user/getPromptData', { uid: `${user.id}-2` });
            if (result1.data.code === 200 && result1.data.data) {
                const form = JSON.parse(result1.data.data.form);
                setPromptData1(form)
            }
            if (result2.data.code === 200 && result2.data.data) {
                setPromptData2(JSON.parse(result2.data.data.form))
            }
        } catch (e) {
            console.log(e);
        }
    }

    const showDetail = async (user) => {
        setCurrentUser(user);
        getPromptData(user);
        setVisible(true);
    }

    useEffect(() => {
        getUserList()
    }, []);

    users.forEach(item => {
        if (item.birthday) {
            const userDate = new Date(item.birthday.replace(/-/g, "/"));
            const now = Date.now();
            const diff = now - userDate.getTime();
            const age = Math.floor(diff / 1000 / 60 / 60 / 24 / 365);
            item.age = age <= 0 ? 0 : age;
        }
    })
    return (
        <>
            <div className='UserList'>
                <div className='UserList-main-title'>
                    用户列表
                </div>
                <div className='UserList-content'>
                    <div className='UserList-row-title'>
                        <div>用户姓名</div>
                        <div>性别</div>
                        <div>手机号</div>
                        <div>年龄</div>
                        <div>注册时间</div>
                        <div>详细信息</div>
                    </div>
                    {
                        users.map(item => (
                            <div className='UserList-row'>
                                <div>{item.name}</div>
                                <div>{item.gender}</div>
                                <div>{item.phone}</div>
                                <div>{item.age}</div>
                                <div>{item.createAt}</div>
                                <div onClick={() => showDetail(item)} className='btn'>详细信息</div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <Drawer width={800} visible={visible} onClose={() => setVisible(false)} title="详细信息" placement="right">
                <div>
                    <Button onClick={() => setActive("baseInfo")} className={`UserList-detail-btn ${active === 'baseInfo' ? 'active' : ''}`}>基础信息</Button>
                    <Button onClick={() => setActive("suizhen7")} className={`UserList-detail-btn ${active === 'suizhen7' ? 'active' : ''}`}>7天随诊记录</Button>
                    <Button onClick={() => setActive("suizhen30")} className={`UserList-detail-btn ${active === 'suizhen30' ? 'active' : ''}`}>30天随诊记录</Button>
                </div>
                <div className='UserList-detail'>
                    {
                        active === 'baseInfo' && BaseInfo.map((item) => (
                            <div className='UserList-detail-row'>
                                <div className='UserList-detail-title'>{item.label}</div>
                                <div className='UserList-detail-value'>{currentUser[item.key] || "未填写"}</div>
                            </div>
                        ))
                    }
                    {
                        active === 'suizhen7' && PromptData1.map((item) => (
                            <div className='UserList-detail-row'>
                                <div className='UserList-detail-title'>{item.label}</div>
                                <div className='UserList-detail-value'>{promptData1[item.key] || "未填写"}</div>
                            </div>
                        ))
                    }
                    {
                        active === 'suizhen30' && PromptData1.map((item) => (
                            <div className='UserList-detail-row'>
                                <div className='UserList-detail-title'>{item.label}</div>
                                <div className='UserList-detail-value'>{promptData2[item.key] || "未填写"}</div>
                            </div>
                        ))
                    }
                </div>
            </Drawer>
        </>
    )
}