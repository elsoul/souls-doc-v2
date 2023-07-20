import Container from '@/components/common/atoms/Container'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import firebaseLogo from '@/assets/img/logo/projects/Firebase.svg'
import googleCloudLogo from '@/assets/img/logo/projects/GoogleCloudHorizontal.svg'
import androidLogo from '@/assets/img/logo/projects/android.svg'
import iosLogo from '@/assets/img/logo/projects/ios.svg'
import typescriptLogo from '@/assets/img/logo/projects/TypeScriptHorizontal.svg'
import { Button } from '@/components/common/atoms/Button'
import clsx from 'clsx'
import SkeetLogoHorizontalLink from '@/components/common/atoms/SkeetLogoHorizontalLink'
import reactLogo from '@/assets/img/logo/projects/react.svg'
import graphqlLogo from '@/assets/img/logo/projects/graphql.svg'
import prismaLogo from '@/assets/img/logo/projects/prisma.svg'

export default function SkeetRow() {
  const { t } = useTranslation()

  return (
    <>
      <div className="relative isolate overflow-hidden">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] dark:stroke-gray-600"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
          />
        </svg>
        <Container className="pb-20 pt-24 text-center lg:pt-40">
          <h1 className="font-display mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-7xl">
            Effortless.
            <br />
            Serverless.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg tracking-tight text-gray-700 dark:text-gray-200">
            {t('common:SkeetRow.body1')}
            <br />
            {t('common:SkeetRow.body2')}
          </p>
          <div className="py-12">
            <SkeetLogoHorizontalLink className="w-42 mx-auto h-12" />
          </div>
          <div className="mt-10 flex justify-center gap-x-6">
            <Button
              href="https://skeet.dev"
              className=""
              target="_blank"
              rel="noreferrer"
            >
              Skeet Docs
            </Button>
            <Button
              href="https://github.com/elsoul/skeet-cli"
              variant="outline"
              className=""
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </Button>
          </div>
          <div className="mb-40 mt-36 lg:mt-48">
            <ul
              role="list"
              className="mt-8 flex flex-col items-center justify-center gap-x-8 sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
            >
              {[
                [
                  {
                    name: 'Firebase',
                    logo: firebaseLogo,
                    link: 'https://firebase.google.com/',
                  },

                  {
                    name: 'Google Cloud',
                    logo: googleCloudLogo,
                    link: 'https://cloud.google.com/',
                  },

                  {
                    name: 'TypeScript',
                    logo: typescriptLogo,
                    link: 'https://www.typescriptlang.org/',
                  },
                  {
                    name: 'Prisma',
                    logo: prismaLogo,
                    link: 'https://www.prisma.io/',
                  },
                ],
                [
                  {
                    name: 'GraphQL',
                    logo: graphqlLogo,
                    link: 'https://graphql.org/',
                  },
                  {
                    name: 'React',
                    logo: reactLogo,
                    link: 'https://react.dev/',
                  },
                  {
                    name: 'iOS',
                    logo: iosLogo,
                    link: 'https://developer.apple.com/',
                  },
                  {
                    name: 'Android',
                    logo: androidLogo,
                    link: 'https://developer.android.com/',
                  },
                ],
              ].map((group, groupIndex) => (
                <li key={`HeroRowLogoCloudList${groupIndex}`}>
                  <ul
                    role="list"
                    className="flex flex-row items-center gap-x-6 sm:gap-x-12"
                  >
                    {group.map((project) => (
                      <li key={project.name} className="flex">
                        <a href={project.link} target="_blank" rel="noreferrer">
                          <Image
                            src={project.logo}
                            alt={project.name}
                            className={clsx(
                              'hover:opacity-60 dark:grayscale',
                              project.name === 'React'
                                ? 'dark:invert-0'
                                : 'dark:invert'
                            )}
                            width={168}
                            height={48}
                            unoptimized
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </>
  )
}
