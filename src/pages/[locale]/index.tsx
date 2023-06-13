import { ReactElement } from 'react'
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic'
import DefaultLayout from '@/layouts/default/DefaultLayout'
import HeroRow from '@/components/pages/home/HeroRow'
import SkeetRow from '@/components/pages/common/SkeetRow'
import ContactRow from '@/components/pages/common/ContactRow'

const seo = {
  pathname: '/',
  title: {
    ja: 'トップページ',
    en: 'Top page',
  },
  description: {
    ja: 'CI/CD 標準装備のスキーマ駆動 Scaffold (自動生成) による開発効率の最大化。より少ない管理コストでグローバル規模のスケールを実現。GCPのサーバーレスです。',
    en: "Maximize development efficiency with schema-driven Scaffold (automatically generated) that comes standard with CI / CD. Achieve global scale with lower management costs. It's serverless running on GCP.",
  },
  img: null,
}

const getStaticProps = makeStaticProps(['common', 'home'], seo)
export { getStaticPaths, getStaticProps }

export default function Home() {
  return (
    <>
      <HeroRow />
      <SkeetRow />
      <ContactRow />
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}
