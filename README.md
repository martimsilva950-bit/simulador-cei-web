# Simulador CEI Web

Website em React/Vite preparado para publicar na Vercel e ligar ao Supabase.

## Instalar e testar

```powershell
cd "C:\Users\Aluno\Documents\Codex\2026-05-29\desenvolvi-uma-aplica-o-para-telem\simulador-cei-web"
npm install
npm run dev
```

Sem Supabase configurado, o site abre em modo demonstração.

Contas de teste:

- `admin@cei.com` com qualquer password
- `cliente@cei.com` com qualquer password

## Configurar Supabase

1. Cria um projeto em Supabase.
2. Vai a SQL Editor.
3. Executa o ficheiro `database/schema.sql`.
4. Copia o Project URL e a chave anon public.
5. Cria um ficheiro `.env` com:

```env
VITE_SUPABASE_URL=https://o-teu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=a-tua-chave-publica-anon
```

Todos os registos feitos no site entram como clientes.
O ficheiro SQL também cria um gatilho automático para preencher a tabela `profiles` quando alguém se regista.

Se o Supabase pedir confirmação por email, o utilizador só consegue iniciar sessão depois de confirmar o email. Para testes, podes desligar temporariamente essa opção em Authentication > Providers > Email.

Para tornar alguém administrador, primeiro regista esse utilizador e depois executa no Supabase:

```sql
update public.profiles
set role = 'admin'
where email = 'email-do-admin@exemplo.com';
```

## Publicar na Vercel

1. Coloca esta pasta num repositório GitHub.
2. Na Vercel, cria um novo projeto e escolhe esse repositório.
3. Em Environment Variables, adiciona:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

4. Faz deploy.

Build command:

```text
npm run build
```

Output directory:

```text
dist
```
