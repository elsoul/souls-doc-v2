import {
  AcademicCapIcon,
  CodeBracketIcon,
  CubeIcon,
  CubeTransparentIcon,
  DocumentTextIcon,
  HeartIcon,
  HomeIcon,
  RectangleGroupIcon,
  RocketLaunchIcon,
  ShareIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline'

export const defaultMainNav = [
  {
    name: 'common:navs.defaultMainNav.doc',
    href: '/doc/',
  },
]

export const commonFooterNav = [
  {
    name: 'common:navs.commonFooterNav.doc',
    href: '/doc/',
  },
  {
    name: 'common:navs.commonFooterNav.privacy',
    href: '/legal/privacy-policy/',
  },
]

export const docMenuNav = [
  { name: 'doc:menuNav.home', href: '/doc/', icon: HomeIcon },
  {
    name: 'doc:menuNav.general.groupTitle',
    children: [
      {
        name: 'doc:menuNav.general.motivation',
        href: '/doc/about/motivation/',
        icon: HeartIcon,
      },
      {
        name: 'doc:menuNav.general.make-a-change-resistant-software',
        href: '/doc/about/make-a-change-resistant-software/',
        icon: HeartIcon,
      },
      {
        name: 'doc:menuNav.general.get-a-comfortable-dev-env',
        href: '/doc/about/get-a-comfortable-dev-env/',
        icon: HeartIcon,
      },
    ],
  },
  {
    name: 'doc:menuNav.general.quickstart',
    href: '/doc/start/quickstart/',
    icon: RocketLaunchIcon,
  },
  {
    name: 'doc:menuNav.tutorial.groupTitle',
    children: [
      {
        name: 'doc:menuNav.tutorial.introduction',
        href: '/doc/tutorial/introduction/',
        icon: AcademicCapIcon,
      },
      {
        name: 'doc:menuNav.tutorial.souls-api-deploy',
        href: '/doc/tutorial/souls-api-deploy/',
        icon: AcademicCapIcon,
      },
      {
        name: 'doc:menuNav.tutorial.create-model',
        href: '/doc/tutorial/create-model/',
        icon: AcademicCapIcon,
      },
      {
        name: 'doc:menuNav.tutorial.execute-scaffold',
        href: '/doc/tutorial/execute-scaffold/',
        icon: AcademicCapIcon,
      },
      {
        name: 'doc:menuNav.tutorial.graphql-batch-loader',
        href: '/doc/tutorial/graphql-batch-loader',
        icon: AcademicCapIcon,
      },
      {
        name: 'doc:menuNav.tutorial.souls-worker-deploy',
        href: '/doc/tutorial/souls-worker-deploy/',
        icon: AcademicCapIcon,
      },
    ],
  },
  {
    name: 'doc:menuNav.basic.groupTitle',
    children: [
      {
        name: 'doc:menuNav.basic.souls-basic-architecture',
        href: '/doc/guides/basic/basic-architecture/',
        icon: RectangleGroupIcon,
      },
      {
        name: 'doc:menuNav.basic.auto-test',
        href: '/doc/guides/basic/auto-test',
        icon: RectangleGroupIcon,
      },
      {
        name: 'doc:menuNav.basic.formatter-rubocop',
        href: '/doc/guides/basic/formatter-rubocop',
        icon: RectangleGroupIcon,
      },
      {
        name: 'doc:menuNav.basic.add-pubsub-messaging',
        href: '/doc/guides/basic/add-pubsub-messaging',
        icon: RectangleGroupIcon,
      },
    ],
  },
  {
    name: 'doc:menuNav.api.groupTitle',
    children: [
      {
        name: 'doc:menuNav.api.api-basic-architecture',
        href: '/doc/guides/api/basic-architecture/',
        icon: CubeTransparentIcon,
      },
      {
        name: 'doc:menuNav.api.graphql-api',
        href: '/doc/guides/api/graphql-api/',
        icon: CubeTransparentIcon,
      },
      {
        name: 'doc:menuNav.api.firebase-user-authentication',
        href: '/doc/guides/api/firebase-user-authentification/',
        icon: CubeTransparentIcon,
      },
      {
        name: 'doc:menuNav.api.update-model',
        href: '/doc/guides/api/update-model/',
        icon: CubeTransparentIcon,
      },
    ],
  },
  {
    name: 'doc:menuNav.worker.groupTitle',
    children: [
      {
        name: 'doc:menuNav.worker.worker-basic-architecture',
        href: '/doc/guides/worker/basic-architecture/',
        icon: CubeIcon,
      },
      {
        name: 'doc:menuNav.worker.add-mailer',
        href: '/doc/guides/worker/add-mailer/',
        icon: CubeIcon,
      },
      {
        name: 'doc:menuNav.worker.add-scraper',
        href: '/doc/guides/worker/add-scraper/',
        icon: CubeIcon,
      },
      {
        name: 'doc:menuNav.worker.cron-job',
        href: '/doc/guides/worker/cron-job/',
        icon: CubeIcon,
      },
      {
        name: 'doc:menuNav.worker.add-cloud-nat',
        href: '/doc/guides/worker/add-cloud-nat/',
        icon: CubeIcon,
      },
    ],
  },
  {
    name: 'doc:menuNav.functions.groupTitle',
    children: [
      {
        name: 'doc:menuNav.functions.functions-basic-architecture',
        href: '/doc/guides/functions/basic-architecture/',
        icon: CodeBracketIcon,
      },
      {
        name: 'doc:menuNav.functions.create-ruby-cloud-functions',
        href: '/doc/guides/functions/create-ruby-cloud-functions/',
        icon: CodeBracketIcon,
      },
      {
        name: 'doc:menuNav.functions.create-nodejs-cloud-functions',
        href: '/doc/guides/functions/create-nodejs-cloud-functions/',
        icon: CodeBracketIcon,
      },
      {
        name: 'doc:menuNav.functions.create-python-cloud-functions',
        href: '/doc/guides/functions/create-python-cloud-functions/',
        icon: CodeBracketIcon,
      },
      {
        name: 'doc:menuNav.functions.create-go-cloud-functions',
        href: '/doc/guides/functions/create-go-cloud-functions/',
        icon: CodeBracketIcon,
      },
    ],
  },
  {
    name: 'doc:menuNav.api-reference.groupTitle',
    children: [
      {
        name: 'doc:menuNav.api-reference.souls-cli-console',
        href: '/doc/api-reference/souls-cli-console/',
        icon: DocumentTextIcon,
      },
      {
        name: 'doc:menuNav.api-reference.souls-cli-create',
        href: '/doc/api-reference/souls-cli-create/',
        icon: DocumentTextIcon,
      },
      {
        name: 'doc:menuNav.api-reference.souls-cli-db',
        href: '/doc/api-reference/souls-cli-db/',
        icon: DocumentTextIcon,
      },
      {
        name: 'doc:menuNav.api-reference.souls-cli-delete',
        href: '/doc/api-reference/souls-cli-delete/',
        icon: DocumentTextIcon,
      },
      {
        name: 'doc:menuNav.api-reference.souls-cli-docker',
        href: '/doc/api-reference/souls-cli-docker/',
        icon: DocumentTextIcon,
      },
      {
        name: 'doc:menuNav.api-reference.souls-cli-gcloud',
        href: '/doc/api-reference/souls-cli-gcloud/',
        icon: DocumentTextIcon,
      },
      {
        name: 'doc:menuNav.api-reference.souls-cli-generate',
        href: '/doc/api-reference/souls-cli-generate/',
        icon: DocumentTextIcon,
      },
      {
        name: 'doc:menuNav.api-reference.souls-cli-github',
        href: '/doc/api-reference/souls-cli-github/',
        icon: DocumentTextIcon,
      },
      {
        name: 'doc:menuNav.api-reference.souls-cli-server',
        href: '/doc/api-reference/souls-cli-server/',
        icon: DocumentTextIcon,
      },
      {
        name: 'doc:menuNav.api-reference.souls-cli-sync',
        href: '/doc/api-reference/souls-cli-sync/',
        icon: DocumentTextIcon,
      },
      {
        name: 'doc:menuNav.api-reference.souls-cli-update',
        href: '/doc/api-reference/souls-cli-update/',
        icon: DocumentTextIcon,
      },
      {
        name: 'doc:menuNav.api-reference.souls-cli-upgrade',
        href: '/doc/api-reference/souls-cli-upgrade/',
        icon: DocumentTextIcon,
      },
    ],
  },
  {
    name: 'doc:menuNav.dependencies.groupTitle',
    children: [
      {
        name: 'doc:menuNav.dependencies.ruby-install',
        href: '/doc/dependencies/ruby/',
        icon: ShareIcon,
      },
      {
        name: 'doc:menuNav.dependencies.psql-install',
        href: '/doc/dependencies/psql/',
        icon: ShareIcon,
      },
      {
        name: 'doc:menuNav.dependencies.github-cli-install',
        href: '/doc/dependencies/github/',
        icon: ShareIcon,
      },
      {
        name: 'doc:menuNav.dependencies.redis-install',
        href: '/doc/dependencies/redis/',
        icon: ShareIcon,
      },
      {
        name: 'doc:menuNav.dependencies.webdriver-install',
        href: '/doc/dependencies/webdriver/',
        icon: ShareIcon,
      },
    ],
  },
  {
    name: 'doc:menuNav.release.groupTitle',
    children: [
      {
        name: 'doc:menuNav.release.roadmap',
        href: '/doc/release/roadmap/',
        icon: SwatchIcon,
      },
      {
        name: 'doc:menuNav.release.history',
        href: '/doc/release/history/',
        icon: SwatchIcon,
      },
    ],
  },
]

export const docHeaderNav = [
  {
    name: 'doc:headerNav.home',
    href: '/',
  },
]
