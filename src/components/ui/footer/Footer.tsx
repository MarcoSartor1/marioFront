import { titleFont } from '@/config/fonts';
import { STORE_NAME } from '@/config/store';
import Link from 'next/link';

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-xs mb-10">

      <Link
        href='/'
      >
        <span className={`${ titleFont.className } antialiased font-bold `}>{ STORE_NAME } </span>
        <span>© { new Date().getFullYear() }</span>
      </Link>

      <Link
        href='/privacy'
        className="mx-3"
      >
        Privacidad & Legal
      </Link>


    </div>
  )
}