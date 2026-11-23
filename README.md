# Beauty Studio (protótipo)

Site de salão de beleza: Next.js + TypeScript + Tailwind + Supabase.

## Rodar localmente
    npm install
    copy .env.example .env.local     (Windows)  |  cp .env.example .env.local
    npm run dev
Abra http://localhost:3000. Sem Supabase configurado, o site abre com dados de demonstração e o agendamento online fica desativado (use o WhatsApp).

## Banco de dados (Supabase)
1. Crie um projeto em supabase.com.
2. SQL Editor: rode `supabase/schema.sql` e, se quiser dados de exemplo, `supabase/seed-demo.sql`.
3. Authentication > Users > Add user (e-mail e senha do administrador).
4. SQL Editor: `insert into admins (user_id) select id from auth.users where email = 'SEU_EMAIL';`
5. Project Settings > API: copie URL, anon key e service_role key para `.env.local`.

## Trocar o nome do salão
`src/lib/config/site.ts` (campo `name`).

## Estrutura
- `src/app` páginas e rotas de API
- `src/components` interface
- `src/services` regras de negócio (disponibilidade, catálogo)
- `src/lib` Supabase, validações e utilitários
- `supabase/` SQL do banco
