import React from 'react'
import Article from '@/app/components/app/article'

export default async ({
    params: { locale, appId },
}) => {
    return <Article appId={appId} />
}
