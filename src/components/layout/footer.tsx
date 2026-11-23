import Link from "next/link";
import { Instagram, MapPin, Clock, MessageCircle } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/config/site";

export function Footer() {
  return (
    <footer className="bg-grafite text-offwhite">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">{siteConfig.name}</p>
          <p className="mt-3 max-w-xs text-sm text-bege/80">{siteConfig.tagline}</p>
        </div>
        <ul className="space-y-3 text-sm text-bege/90">
          <li className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 shrink-0" />{siteConfig.address}</li>
          <li className="flex items-start gap-3"><Clock size={18} className="mt-0.5 shrink-0" />{siteConfig.hours}</li>
          <li>
            <a href={whatsappLink()} className="flex items-center gap-3 hover:text-dourado">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </li>
          <li className="flex items-center gap-3 text-bege/60">
            <Instagram size={18} /> Redes sociais (a definir)
          </li>
        </ul>
        <ul className="space-y-2 text-sm">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-bege/80 hover:text-dourado">{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-bege/60">
        © {new Date().getFullYear()} {siteConfig.name}. Protótipo em desenvolvimento.
      </div>
    </footer>
  );
}
