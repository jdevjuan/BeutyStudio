"use client";

import { useState } from "react";
import { ImageSlot } from "@/components/home/image-slot";
import { cn } from "@/lib/utils/cn";
import { categoriasGaleria, galeriaDemo } from "@/lib/data/demo";

export function GalleryGrid() {
  const [ativa, setAtiva] = useState<string>("Todos");
  const itens = ativa === "Todos" ? galeriaDemo : galeriaDemo.filter((i) => i.categoria === ativa);

  return (
    <div>
      <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
        {categoriasGaleria.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={ativa === c}
            onClick={() => setAtiva(c)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dourado",
              ativa === c ? "border-grafite bg-grafite text-offwhite" : "border-bege bg-white text-marrom hover:border-grafite"
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {itens.map((i) => (
          <li key={i.id}>
            <ImageSlot label={i.categoria} className="aspect-square" />
          </li>
        ))}
      </ul>
    </div>
  );
}
