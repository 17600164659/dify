import I18nServer from './components/i18n-server'
import SentryInitor from './components/sentry-initor'
import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'

export const metadata = {
  title: 'iPollo.AI',
}

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()

  return (
    <html lang={locale ?? 'en'} className="h-full">
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-RNG07PD89H"></script>
      {/* <script> window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-RNG07PD89H'); </script> */}
      <meta property="og:title" content="iPollo ai" />
      <meta name="keywords" content="iPollo，iPollo.ai,iPollo AI,AI工具,AI工具箱,AI工具集,AI应用市场,人工智能,AI,AIGC,AI产品" />
      <body
        className="h-full"
        data-api-prefix={process.env.NEXT_PUBLIC_API_PREFIX}
        data-pubic-api-prefix={process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX}
        data-public-edition={process.env.NEXT_PUBLIC_EDITION}
        data-public-sentry-dsn={process.env.NEXT_PUBLIC_SENTRY_DSN}
      >
        <SentryInitor>
          {/* @ts-expect-error Async Server Component */}
          <I18nServer locale={locale}>{children}</I18nServer>
        </SentryInitor>
      </body>
    </html>
  )
}

export default LocaleLayout
