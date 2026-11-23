import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Espaço reservado para fotografia profissional (substituir por <Image /> depois). */
export function ImageSlot({ label, className }: { label: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`Espaço para foto: ${label}`}
      className={cn("flex flex-col items-center justify-center gap-2 rounded-suave bg-bege text-marrom", className)}
    >
      <ImageIcon size={28} strokeWidth={1.25} />
      <span className="px-4 text-center text-xs">Foto: {label}</span>
    </div>
  );
}
