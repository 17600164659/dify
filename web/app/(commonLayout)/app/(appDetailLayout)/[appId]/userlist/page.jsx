import React from 'react'
import UserList from '@/app/components/app/userlist'

export default async ({
    params: { locale, appId },
}) => {
    return <UserList appId={appId} />
}
