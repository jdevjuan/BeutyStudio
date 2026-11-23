import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "./image-slot";

const slots = ["corte", "coloração", "penteado", "antes e depois"];

export function GalleryPreview() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <h2 className="text-3xl sm:text-4xl">Galeria de trabalhos</h2>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {slots.map((s) => (
          <ImageSlot key={s} label={s} className="aspect-square" />
        ))}
      </div>
      <Button asChild variant="outline" className="mt-8"><Link href="/galeria">Ver galeria completa</Link></Button>
    </section>
  );
}
