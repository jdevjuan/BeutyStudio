import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const metadata: Metadata = {
  title: "Galeria",
  description: "Veja cortes, colorações, penteados e transformações realizados pelo salão.",
};

export default function GaleriaPage() {
  return (
    <>
      <PageHeader title="Galeria" description="Trabalhos realizados pelo salão. As imagens abaixo são espaços reservados para as fotos reais." />
      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <GalleryGrid />
      </section>
    </>
  );
}
