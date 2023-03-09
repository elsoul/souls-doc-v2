import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Link from '@/components/routing/Link'
import type { BlogIndex } from '@/types/article'

type Props = {
  articles: BlogIndex[]
  urls: string[]
}

export default function BlogPageIndex({ articles, urls }: Props) {
  const { t } = useTranslation()

  return (
    <>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              News
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-y-20 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {articles.map((article, index) => (
              <article
                key={`BlogIndex Article${article.title}`}
                className="group flex flex-col items-start justify-between hover:cursor-pointer"
              >
                <Link href={urls[index]}>
                  <div className="relative w-full">
                    <Image
                      src={article.thumbnail}
                      alt={article.title}
                      width="640"
                      height="320"
                      className="aspect-[16/9] w-full bg-gray-50 object-cover group-hover:opacity-80 dark:bg-gray-800 sm:aspect-[2/1] lg:aspect-[3/2]"
                      unoptimized
                    />
                  </div>
                  <div className="max-w-xl">
                    <div className="mt-8 flex items-center gap-x-4 text-xs">
                      <time
                        dateTime={article.date}
                        className="text-gray-500 group-hover:text-gray-700 dark:text-gray-300 dark:group-hover:text-gray-500"
                      >
                        {article.date}
                      </time>
                      <span className="relative z-10 bg-gray-50 py-1.5 px-3 font-medium text-gray-600 group-hover:bg-gray-100 dark:bg-gray-500 dark:text-gray-50 dark:group-hover:bg-gray-700">
                        {article.category}
                      </span>
                    </div>
                    <div className="relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 dark:text-gray-50 dark:group-hover:text-gray-300">
                        <a href={urls[index]}>
                          <span className="absolute inset-0" />
                          {article.title}
                        </a>
                      </h3>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
