import Container from '@/components/common/atoms/Container'
import { useTranslation } from 'next-i18next'
import { Button } from '@/components/common/atoms/Button'

export default function HomeHeroRow() {
  const { t } = useTranslation()

  return (
    <>
      <Container className="pt-24 pb-20 text-center lg:py-40">
        <h1 className="font-display mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-7xl">
          SOULs is now Deprecated🙏
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-700 dark:text-gray-200">
          {t('home:HeroRow.body')}
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Button href="/doc" variant="outline" className="">
            {t('common:navs.defaultMainNav.doc')}
          </Button>
          <Button
            href="https://github.com/elsoul/souls"
            variant="outline"
            className=""
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Button>
        </div>
      </Container>
    </>
  )
}
