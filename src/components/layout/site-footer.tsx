import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

const socials = [
  {
    label: "Facebook",
    color: "hover:bg-blue-500",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.5-3.9 3.79-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z",
  },
  {
    label: "Twitter",
    color: "hover:bg-sky-500",
    path: "M18.244 2H21.5l-7.5 8.57L23 22h-6.84l-5.36-6.99L4.6 22H1.34l8.02-9.16L1 2h6.99l4.84 6.4L18.24 2Zm-1.2 18h1.86L7.05 4H5.05l12 16Z",
  },
  {
    label: "Instagram",
    color: "hover:bg-pink-500",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.73 1.46 1.38 2.13a5.86 5.86 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4Zm6.4-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z",
  },
  {
    label: "LinkedIn",
    color: "hover:bg-blue-600",
    path: "M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.36-1.85c3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 2.06-2.06 2.06 2.06 0 0 1-2.06 2.06ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77A1.75 1.75 0 0 0 0 1.73v20.54A1.75 1.75 0 0 0 1.77 24h20.45A1.76 1.76 0 0 0 24 22.27V1.73A1.76 1.76 0 0 0 22.22 0Z",
  },
];

export async function SiteFooter() {
  const { t } = await getDict();

  return (
    <footer className="relative mt-16 text-emerald-50 bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-400 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-teal-400 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-56 w-56 rounded-full bg-lime-400 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-1 ring-2 ring-white/20 backdrop-blur">
                <Image
                  src="/logo.png"
                  alt="Mboa Property Group"
                  width={40}
                  height={40}
                  className="object-contain rounded-lg bg-white"
                />
              </div>
              <span className="font-bold text-lg text-white">Mboa Property Group</span>
            </Link>
            <p className="mt-4 text-sm text-emerald-100/80 leading-relaxed">{t.footer.tagline}</p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ label, color, path }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition ${color}`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white uppercase tracking-wider">{t.footer.company}</p>
            <span className="mt-2 block h-0.5 w-10 rounded-full bg-gradient-to-r from-emerald-300 to-lime-300" />
            <ul className="mt-4 space-y-2 text-sm text-emerald-100/80">
              <li><Link href="/services" className="hover:text-white transition-colors">{t.footer.links.services}</Link></li>
              <li><Link href="/rentals" className="hover:text-white transition-colors">{t.footer.links.rentals}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t.footer.links.about}</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">{t.footer.links.news}</Link></li>
              <li><Link href="/partners" className="hover:text-white transition-colors">{t.footer.links.partners}</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">{t.footer.links.careers}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t.footer.links.contact}</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white uppercase tracking-wider">{t.footer.account}</p>
            <span className="mt-2 block h-0.5 w-10 rounded-full bg-gradient-to-r from-teal-300 to-emerald-300" />
            <ul className="mt-4 space-y-2 text-sm text-emerald-100/80">
              <li><Link href="/auth/login" className="hover:text-white transition-colors">{t.footer.links.signIn}</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">{t.footer.links.getStarted}</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">{t.footer.links.dashboard}</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white uppercase tracking-wider">{t.footer.getInTouch}</p>
            <span className="mt-2 block h-0.5 w-10 rounded-full bg-gradient-to-r from-lime-300 to-teal-300" />
            <ul className="mt-4 space-y-3 text-sm text-emerald-100/80">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-emerald-300 shrink-0" />
                <a href="mailto:hello@mboapropertygroup.com" className="hover:text-white transition-colors">
                  hello@mboapropertygroup.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-teal-300 shrink-0" />
                <a href="tel:+237600000000" className="hover:text-white transition-colors">
                  +237 6 00 00 00 00
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-lime-300 shrink-0" />
                <span>{t.footer.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-emerald-100/70">
          <p>&copy; {new Date().getFullYear()} Mboa Property Group. {t.footer.copyright}</p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {t.footer.madeWith}
          </p>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-400" />
    </footer>
  );
}
