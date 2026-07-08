# StudyLeia — Projeto completo (backend + frontend)

Plataforma de estudos gamificada com a gata Leia como personagem central.
Backend em Spring Boot (Java), frontend em React + TypeScript.

## Estrutura

```
StudyLeia-completo/
├── backend/     Spring Boot + MySQL (Docker Compose) + Flyway
└── frontend/    React 19 + TypeScript + Vite
```

## Importante — sobre o banco de dados

O briefing pede MySQL via **XAMPP/phpMyAdmin**. O projeto já roda em
**MySQL de verdade**, mas via **Docker Compose** em vez de XAMPP — é
mais simples de subir (um comando, sem instalar XAMPP à parte) e mais
próximo de como isso rodaria em produção. O **phpMyAdmin também já vem
junto no `docker compose up`** (serviço `phpmyadmin`, porta `8082`),
então dá pra inspecionar/editar o banco pelo navegador exatamente como
no XAMPP, sem precisar instalar nada a mais — veja a seção abaixo.
Se você preferir mesmo assim usar XAMPP: basta apontar
`SPRING_DATASOURCE_URL` no `application.yml` para o MySQL do XAMPP
(porta padrão 3306) e criar o schema `memora_db` pelo phpMyAdmin do
próprio XAMPP — as migrations do Flyway criam as tabelas sozinhas na
primeira execução, então funciona com qualquer MySQL 8+.

## Como rodar

### 1. Backend + banco + phpMyAdmin (Docker Compose — recomendado)

```bash
docker compose up
```

(rode este comando na raiz do projeto — `StudyLeia-completo/`, onde está
o `docker-compose.yml` — e não dentro de `backend/`.)

Isso sobe o MySQL, a API Spring Boot, o frontend e o phpMyAdmin juntos:

| Serviço              | URL                          |
| --------------------- | ---------------------------- |
| Frontend (React)      | http://localhost:5173        |
| Backend (API)         | http://localhost:8080        |
| **phpMyAdmin (banco)**| **http://localhost:8082**    |
| MySQL (cliente externo)| `localhost:3307`            |

No phpMyAdmin, o servidor "mysql" já vem pré-selecionado — basta logar
com usuário `root` e a senha definida em `MYSQL_ROOT_PASSWORD` (padrão:
`memora_root_pw`, ver `.env.example`). O banco `memora_db` e todas as
tabelas já existem assim que o Flyway roda as migrations na primeira
subida.

Não precisa configurar mais nada — todas as variáveis (senha do banco,
JWT secret, etc.) já têm valor padrão no `docker-compose.yml`.

Para usar quizzes/planos gerados por IA de verdade (em vez do modo
Mock), copie `.env.example` para `.env` na raiz do projeto e
preencha `GEMINI_API_KEY` (ou `GROQ_API_KEY`/`OPENROUTER_API_KEY`) —
veja `backend/README.md` para detalhes.

### 1b. Alternativa sem Docker

```bash
cd backend
export MEMORA_IA_PROVIDER=MOCK   # ou configure sua chave de IA
mvn spring-boot:run
```
Nesse caso você precisa ter um MySQL rodando (XAMPP, instalação local
etc.) e ajustar a conexão em `src/main/resources/application.yml`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # já aponta para localhost:8080
npm run dev             # http://localhost:5173
```

## O que já está pronto

Toda a migração de Thymeleaf para React foi concluída: autenticação,
dashboard, a Leia (com identidade visual própria — creme/caramelo,
olhos azuis, reagindo a XP/level up/compras/humor), quizzes manuais e
gerados por IA, plano de estudos com IA, anotações, calendário, modo
foco (Pomodoro), missões diárias, conquistas, jardim, loja e
estatísticas. Veja `backend/docs/API_CONTRACT.md` para o contrato
completo dos 70 endpoints REST.

## Documentação adicional

- `backend/README.md`, `backend/ARCHITECTURE.md`, `backend/DATABASE.md` — detalhes do backend
- `frontend/README.md` — stack e estrutura de pastas do frontend
