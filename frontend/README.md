# StudyLeia — Frontend (React)

Frontend novo do StudyLeia, migrando gradualmente do antigo Thymeleaf
para React 19 + TypeScript, seguindo o plano de migração em fases
(ver `docs/API_CONTRACT.md` no repositório do backend).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (tema azul definido em `src/index.css`)
- React Router (rotas em `src/routes/AppRouter.tsx`)
- TanStack Query (cache/estado de servidor)
- React Hook Form + Zod (formulários — a partir da Fase 4)
- Framer Motion (animações leves — Leia e feedback de gamificação)
- Axios (`src/services/api.ts` — único ponto de chamada HTTP)

## Como rodar

```bash
npm install
cp .env.example .env   # aponta para o backend em localhost:8080
npm run dev            # http://localhost:5173
```

O backend (Spring Boot) precisa estar rodando via `mvn spring-boot:run`
ou `docker compose up` no projeto `studyleia` para as chamadas de API
funcionarem.

## Estrutura

```
src/
  app/          # providers (query client, etc.)
  components/   # design system (ui/) e componentes compartilhados (shared/)
  contexts/      # AuthContext
  features/     # lógica específica de cada domínio (dashboard, leia, quiz...)
  hooks/
  layouts/      # AppLayout (casca das telas autenticadas)
  pages/        # uma página por rota
  routes/       # AppRouter + ProtectedRoute
  services/     # 1 arquivo por domínio, chama a API tipada
  types/        # interfaces espelhando os DTOs do backend
  utils/
```

## Status (Fase 2 do plano de migração)

Scaffold funcional: build limpo, rotas protegidas por JWT, camada de
serviços e tipos já cobrindo os 70 endpoints do backend. Todas as
páginas ainda são placeholders — cada uma vira tela real na fase do
plano em que estiver marcada (visível no próprio placeholder em dev).

Próxima fase: Design System (Button, Card, Input, Badge, Progress...).
