import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <DefaultSeo
      defaultTitle="デフォルトのタイトル"
      description="デフォルトの説明"
      openGraph={{
        type: "website",
        title: "デフォルトのタイトル",
        description: "デフォルトの説明",
        site_name: "サイトの名前",
        url: "サイトのURL",
        images: [
          {
            url: "https://www.example.ie/og-image-01.jpg",
            width: 800,
            height: 600,
            alt: 'Og Image Alt',
            type: 'image/jpeg',
          },
        ],
      }}
      twitter={{
        handle: '@handle',
        site: '@site',
        cardType: "summary_large_image",
      }}
    />
    <Component {...pageProps} />
  </>
}

export default MyApp
