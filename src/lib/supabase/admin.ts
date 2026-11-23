import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Cliente com chave secreta. Use SOMENTE no servidor (API routes). Ignora RLS. */
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false },
  });
}
