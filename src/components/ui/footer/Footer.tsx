import { titleFont } from '@/config/fonts';
import { STORE_NAME } from '@/config/store';
import { getStoreConfig } from '@/actions';
import Link from 'next/link';
import { IoLogoFacebook, IoLogoInstagram, IoLogoWhatsapp } from 'react-icons/io5';

export const Footer = async () => {
  const { config } = await getStoreConfig();

  const hasSocialLinks = config.facebookUrl || config.instagramUrl || config.whatsapp;

  return (
    <div className="flex w-full flex-col items-center gap-3 text-xs mb-10">

      {hasSocialLinks && (
        <div className="flex gap-4">
          {config.facebookUrl && (
            <a
              href={config.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-500 hover:text-blue-600"
            >
              <IoLogoFacebook size={22} />
            </a>
          )}
          {config.instagramUrl && (
            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-500 hover:text-pink-600"
            >
              <IoLogoInstagram size={22} />
            </a>
          )}
          {config.whatsapp && (
            <a
              href={`https://wa.me/${config.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-gray-500 hover:text-green-600"
            >
              <IoLogoWhatsapp size={22} />
            </a>
          )}
        </div>
      )}

      <div className="flex justify-center">
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

    </div>
  )
}