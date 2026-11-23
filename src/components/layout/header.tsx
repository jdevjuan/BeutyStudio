"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/button";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bege bg-offwhite/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="font-serif text-xl text-grafite">
          {siteConfig.name}
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
          {siteConfig.nav.slice(0, -1).map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-marrom transition-colors hover:text-grafite">
              {item.label}
            </Link>
          ))}
          <Link href="/contato" className="text-sm text-marrom transition-colors hover:text-grafite">
            Contato
          </Link>
          <Button asChild size="sm">
            <Link href="/agendamento">Agendar horário</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="p-2 text-grafite lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav aria-label="Principal (celular)" className="border-t border-bege bg-offwhite px-5 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-bege/70 py-3 text-marrom hover:text-grafite"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
