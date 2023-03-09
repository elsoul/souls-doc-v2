import Link from '@/components/routing/Link'
import Image from 'next/image'
import logoHorizontal from '@/assets/img/logo/SOULsLogoHorizontal.svg'
import logoHorizontalInvert from '@/assets/img/logo/SOULsLogoHorizontalInvert.svg'
import clsx from 'clsx'

type Props = {
  className?: string
  href?: string
  onClick?: () => void
}

export default function LogoHorizontalLink({
  className,
  href = '/',
  ...rest
}: Props) {
  return (
    <>
      <Link href={href} {...rest}>
        <span className="sr-only">SOULs Framework</span>
        <Image
          src={logoHorizontal}
          alt="SOULs Framework"
          className={clsx('dark:hidden ', className)}
          unoptimized
        />
        <Image
          src={logoHorizontalInvert}
          alt="SOULs Framework"
          className={clsx('hidden dark:block', className)}
          unoptimized
        />
      </Link>
    </>
  )
}
