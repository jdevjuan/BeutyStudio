import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/config/site";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Olá! Gostaria de agendar um horário.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-grafite text-offwhite ring-1 ring-dourado/60 transition-colors hover:bg-marrom focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dourado"
    >
      <MessageCircle size={24} />
    </a>
  );
}
