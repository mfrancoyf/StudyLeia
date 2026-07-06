<div align="center">

# 🐾 StudyLeia

### Gamified Study Platform — Take care of Leia. Build consistent habits.


<!-- 🎬 GIF de demonstração — substitua este banner estático pelo GIF real quando tiver gravado -->
<img src="./assets/Banner.gif" alt="StudyLeia — gamifique seus estudos, evolua todos os dias" width="100%" />


<br />

[![Java](https://img.shields.io/badge/Java-21-007396?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Flyway](https://img.shields.io/badge/Flyway-11%20migrations-CC0200?style=for-the-badge&logo=flyway&logoColor=white)](https://flywaydb.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Mobile First](https://img.shields.io/badge/Mobile-First-FF6B6B?style=for-the-badge)](#-mobile-first)

[![License](https://img.shields.io/badge/license-Privado-lightgrey?style=flat-square)]()
[![Java Files](https://img.shields.io/badge/Java%20files-162-blue?style=flat-square)]()
[![Endpoints](https://img.shields.io/badge/REST%20endpoints-70-orange?style=flat-square)]()
[![Tests](https://img.shields.io/badge/testes-JUnit%205%20%2B%20Mockito-25A162?style=flat-square)]()

**StudyLeia** é uma plataforma de estudos gamificada onde cada quiz respondido,
cada anotação criada e cada sessão de foco concluída alimenta o progresso da
usuária **e** a felicidade da sua mascote virtual, a gatinha **Leia**.

[📌 Sobre](#-sobre-o-projeto) · [✨ Funcionalidades](#-funcionalidades) · [🐱 A Leia](#-a-leia) · [🏗️ Arquitetura](#-arquitetura) · [🚀 Como executar](#-como-executar)

</div>

---

## 📌 Sobre o projeto

A ideia do projeto surgiu porque minha namorada estava se preparando para
o vestibular, e eu queria fazer algo que ajudasse ela a manter o ritmo de
estudo, porque a parte mais difícil nunca é entender o conteúdo, é voltar
a abrir o caderno todo dia. Ela tem uma gata de verdade chamada **Leia**,
que é praticamente parte da família lá em casa, e pensei: e se eu
transformasse essa gata em uma mascote virtual, que evolui e fica feliz
conforme ela estuda? Foi assim que a Leia do app nasceu, com nome e jeito
inspirados na gata de verdade, antes mesmo de eu escrever a primeira linha
de código de gamificação.

O projeto acabou servindo pra duas coisas ao mesmo tempo. Pra ela, virou
uma forma de manter a constância nos estudos pra prova mais importante da
vida acadêmica dela até agora. Pra mim, virou a desculpa perfeita pra
sair do tutorial e do to-do-list genérico e praticar de verdade
arquitetura de software, Spring Security, modelagem de banco e frontend
mobile-first, em um sistema grande o suficiente pra me obrigar a tomar
decisões reais.

E por isso o StudyLeia não tem aquelas features genéricas que todo app de
estudo tem só porque "tem que ter". Cada módulo nasceu de uma necessidade
concreta que apareceu enquanto ela estudava: faltava constância, então
nasceu o streak. Faltava se sentir acompanhada enquanto estudava sozinha,
então a Leia passou a reagir a cada XP ganho. Faltava organizar o
conteúdo gigante do vestibular, então nasceu o plano de estudos gerado
por IA. Faltava revisar rápido entre uma matéria e outra, então nasceu o
quiz.
---

## 🎬 Demonstração

| | |
|---|---|
| 🎥 **Vídeo** | _[link para o vídeo de demonstração — a adicionar]_ |
| 🖼️ **GIF** | _[GIF de navegação fim a fim — a adicionar]_ |

Veja também a seção [📸 Screenshots](#-screenshots) para capturas de tela por módulo.

---

## ✨ Funcionalidades

O produto é organizado em **18 módulos de domínio** no backend (pacote
`com.memora`), cada um exposto por uma página Thymeleaf funcional.

### 🏠 Dashboard
Tela inicial que agrega, em uma única leitura, o estado atual da Leia, o
progresso de gamificação (XP, nível, moedas, streak), as missões diárias em
andamento e os próximos eventos do calendário.

### 🐾 Leia (mascote virtual)
Painel dedicado à interação com a Leia: humor e estágio de evolução atuais,
carinho manual, e os cosméticos/cenário equipados. Ver a seção
[🐱 A Leia](#-a-leia) para os detalhes de design.

### 🏆 Gamificação
Painel de conquistas (*achievements*) desbloqueadas e em progresso, streak
atual e recorde de sequência de dias estudados. Ver a seção
[🎮 Gamificação](#-gamificação) para o detalhamento completo do sistema.

### 🛍️ Loja
Catálogo combinado de **cosméticos** (laços, óculos, chapéus, gravatas e
acessórios especiais para a Leia) e **cenários de fundo**, com sistema de
raridade (Comum / Rara / Épica / Lendária), compra com moedas, equipagem e
histórico de compras.

### 🌱 Jardim
Mecânica paralela de cultivo: a usuária planta sementes (ganhas ao estudar)
em vasos, e cada planta cresce com base em uma combinação de **tempo
decorrido + XP ganho** desde o plantio — recompensando tanto consistência
quanto volume de estudo.

### 📅 Plano de Estudos
Geração de cronogramas de estudo via IA a partir de matéria, data da prova e
horas disponíveis por dia, decompostos em itens individuais
(Estudo / Revisão / Simulado) que podem ser marcados como concluídos um a
um.

### 📝 Quiz
Criação manual de quizzes ou geração automática via IA a partir de um tema.
Fluxo de resposta gamificado, com XP por questão correta, XP de bônus por
completar o quiz inteiro, e registro de cada tentativa para as estatísticas
de desempenho por matéria.

### 🍅 Modo Foco
Sessões de Pomodoro (foco/pausa); cada sessão concluída é registrada e gera
XP e moedas.

### 🎯 Missões Diárias
Quatro tipos de missão (responder 10 questões, criar 1 anotação, estudar 30
minutos, completar o plano do dia) geradas automaticamente todo dia para
cada usuária ativa, com meta e recompensa próprias.

### 🗓️ Calendário
Registro de eventos acadêmicos (provas, trabalhos, apresentações,
lembretes) com alerta automático para eventos nas próximas 48 horas.

> 💬 **Nota de transparência**: a página atual é uma lista cronológica de
> eventos, não um grid visual de mês — atende ao escopo definido, mas um
> calendário visual completo é uma evolução natural listada no
> [Roadmap](#-roadmap).

### 📊 Estatísticas
Painel com gráficos (Chart.js) de desempenho, taxa de acerto por matéria e
atividade geral, consumindo dados agregados de quizzes, notas, planos e
sessões de foco.

### 📓 Anotações
CRUD simples de notas de estudo, cada criação gerando XP.

### 👤 Perfil & Autenticação
Cadastro, login, logout, recuperação de senha (token por e-mail) e edição
de perfil. Sessão mantida via JWT em cookie `HttpOnly` — ver a seção
[🔐 Segurança](#-segurança).

---

## 🐱 A Leia

A Leia não é um avatar estático — ela é o **indicador emocional do progresso
da usuária**, renderizada inteiramente em SVG/CSS, sem nenhuma dependência
de imagem externa.

| Aspecto | Como funciona |
|---|---|
| **Humor** | 5 estados — `TRISTE`, `ENTEDIADA`, `NEUTRA`, `FELIZ`, `SUPER_FELIZ` — que sobem a cada recompensa de gamificação e decaem automaticamente por inatividade (job a cada 6h). |
| **Evolução** | 5 estágios visuais atrelados ao nível da conta — `FILHOTE` (níveis 1–4), `JOVEM` (5–9), `ADULTA` (10–19), `SÁBIA` (20–29) e `RAINHA_LEIA` (30+). |
| **Animações** | Respiração contínua, piscar, balanço de rabo e reações de humor, tudo via CSS puro, sem imagens rasterizadas. |
| **Carinho** | Toque/clique manual na mascote, registrado como interação (`POST /api/pet/carinho`). |
| **Personalização** | Overlay de cosméticos equipados (laço, óculos, chapéu, gravata, acessório especial), desenhado como vetor dentro do mesmo `<svg>` da Leia. |
| **Papel na plataforma** | Funciona como o "termômetro" emocional de toda a gamificação — em vez de só olhar uma barra de XP, a usuária olha para a Leia e sente, visualmente, se está cuidando bem da sua rotina de estudos. |

A combinação de 5 humores × 5 estágios é resolvida por uma única API de
exibição (`mascote(humor, estagio, tamanho)` em `fragments/leia.html`), o
que permite evoluir a arte visual sem tocar em nenhuma regra de negócio do
backend.

> 💬 **Nota de transparência**: hoje, o **cenário de fundo** atrás da Leia é
> um valor de gradiente CSS aplicado ao container principal (armazenado em
> `background_themes.gradiente`), não um conjunto de elementos gráficos
> animados e interativos por ambiente. A mascote em si (corpo, humor,
> evolução e acessórios) já é inteiramente vetorial e viva; o cenário é a
> peça que ainda está no nível "cor de fundo" e é a próxima evolução natural
> do sistema (ver [Roadmap](#-roadmap)).

---

## 🎮 Gamificação

Toda atividade gamificável passa por um único método central —
`GamificationService.concederRecompensa(usuario, TipoAtividade.X)` — o que
garante consistência entre todos os módulos que concedem recompensa.

### Fontes de XP e moedas

| Atividade | XP | Moedas |
|---|---|---|
| Resposta correta de quiz | 10 | 2 |
| Resposta errada de quiz | 2 | 0 |
| Quiz completo (bônus) | 15 | 5 |
| Anotação criada | 5 | 1 |
| Plano de estudos concluído | 20 | 8 |
| Sessão de foco concluída | 12 | 3 |
| Missão diária concluída | 8 | 4 |
| Evento de calendário criado | 3 | 1 |

### Progressão de nível

Fórmula de crescimento quadrático suave (estilo *Duolingo*), sem tabela de
níveis fixa:

```
XP acumulado para o nível N = 50 × N × (N + 1) / 2
```

| Nível | XP acumulado necessário |
|---|---|
| 1 | 0 |
| 2 | 100 |
| 3 | 300 |
| 5 | 750 |
| 10 | 2.750 |

### Streak (sequência)

Sequência atual e recorde pessoal de dias estudados, quebrada
automaticamente por um job diário caso a usuária passe um dia inteiro sem
nenhuma atividade gamificável.

### Conquistas (Achievements)

**12 conquistas** com regra de desbloqueio própria, verificadas a cada
atividade relevante: primeira prova, sequência de 7 e 30 dias, 100 questões
respondidas, 1.000 e 5.000 XP, primeira anotação, primeiro plano concluído,
10 quizzes criados, e níveis 10 / 20 / 30.

### Missões diárias

4 tipos com meta própria, geradas automaticamente todo dia para cada
usuária ativa: responder 10 questões, criar 1 anotação, estudar 30 minutos,
completar o plano do dia.

### Recompensas em cadeia

Conceder XP a uma atividade dispara, em um único fluxo: atualização do
placar de progresso → recálculo de nível → atualização de humor/evolução da
Leia → registro de streak → verificação de conquistas → publicação de um
evento de domínio (consumido pelo Jardim para creditar sementes) → resposta
única usada pelo frontend para decidir toasts e badges.

---

## 🏗️ Arquitetura

Aplicação **monolítica Spring Boot**, server-rendered com Thymeleaf,
organizada por **"package by feature"** — cada módulo de domínio agrupa
internamente suas próprias camadas (`controller` → `service` → `repository`
→ `entity`/`dto`), em vez de um pacote único e gigante por camada técnica.

```
com.memora
├── auth/            cadastro, login, perfil, recuperação de senha
├── config/          configuração geral + segurança (JWT, Spring Security)
├── exception/       exceções de negócio + handler global
├── common/          BaseEntity e utilitários compartilhados
├── gamification/    XP, nível, moedas, streak, conquistas (orquestrador central)
├── pet/             humor e evolução visual da Leia
├── notes/           anotações de estudo
├── quiz/            quizzes manuais e gerados por IA
├── integration/ai/  camada desacoplada de provedores de IA
├── studyplan/       planos de estudo via IA
├── calendar/        eventos e alertas
├── focus/           sessões de Modo Foco (Pomodoro)
├── dailymission/    missões diárias
├── dashboard/       agregador de leitura para a tela inicial
├── shop/            catálogo combinado, compras, inventário
├── cosmetic/        catálogo de cosméticos (conteúdo estático)
├── background/      catálogo de cenários (conteúdo estático)
├── garden/          jardim: sementes, plantio, crescimento
└── statistics/      métricas agregadas (somente leitura)
```

### Responsabilidade de cada camada

| Camada | Responsabilidade |
|---|---|
| `controller/` | Recebe a requisição, delega ao Service, devolve `ResponseEntity` — não contém regra de negócio. |
| `service/` | Regra de negócio, `@Transactional`, validação de propriedade do recurso. |
| `repository/` | Interfaces Spring Data JPA. |
| `entity/` | Entidades JPA (PK `UUID`, FKs `LAZY`, `BaseEntity` para timestamps automáticos). |
| `dto/` | `record`s de entrada/saída com Bean Validation. |
| `mapper/` | Interfaces MapStruct para mapeamento entidade → DTO. |

### Fluxo de uma requisição autenticada

```
Navegador
  │  cookie HttpOnly "memora_token" (JWT) enviado automaticamente
  ▼
JwtAuthFilter (OncePerRequestFilter)
  │  extrai e valida o token, popula o SecurityContext
  ▼
SecurityConfig
  │  rotas públicas liberadas · todo o resto exige autenticação
  ▼
Controller → Service (@Transactional) → Repository (Spring Data JPA) → MySQL
```

### Gamificação como serviço central

Nenhum módulo soma XP diretamente — todos chamam
`gamificationService.concederRecompensa(usuario, TipoAtividade.X)`, o que
mantém as regras de pontuação centralizadas e fáceis de auditar.

### Comunicação entre módulos sem dependência circular

O Jardim precisa reagir a ganhos de XP sem que o módulo de gamificação
conheça sua existência. A solução é um **evento de domínio Spring**
(publicado via `ApplicationEventPublisher` e consumido via
`@EventListener`).

### Automação em background

**5 jobs `@Scheduled`**, cada um delegando a lógica real ao Service do
módulo correspondente:

| Job | Função |
|---|---|
| `PetDecaySchedulerJob` | Decai o humor da Leia por inatividade |
| `StreakSchedulerJob` | Quebra sequências de quem não estudou no dia anterior |
| `CalendarAlertSchedulerJob` | Marca eventos próximos como notificados |
| `DailyMissionSchedulerJob` | Gera as missões do dia de cada usuária ativa |
| `GardenSchedulerJob` | Recalcula o crescimento de todas as plantas |

### Camada de IA desacoplada

```
Controller → Service de domínio → Service de IA → interface AIProvider → implementação concreta
```

A geração de quizzes (`AIQuizGeneratorService`) e de planos de estudo
(`AIStudyPlanGeneratorService`) depende apenas da interface `AIProvider` —
nenhum dos dois conhece qual provedor externo está ativo. **4 implementações
concretas** competem pelo mesmo contrato:

| Implementação | Descrição |
|---|---|
| `MockAIProvider` | Gera questões/planos localmente, sem chamada externa — provider padrão, não exige nenhuma chave. |
| `GeminiAIProvider` | Integração real com a API do Google Gemini (`gemini-1.5-flash` por padrão), via `WebClient` reativo. |
| `GroqAIProvider` | Integração real com a API da Groq (modelo Llama, camada gratuita). |
| `OpenRouterAIProvider` | Integração real com a API da OpenRouter, com acesso a modelos gratuitos. |

`AIProviderConfig` resolve, em tempo de inicialização, qual bean expor como
`AIProvider` `@Primary`, lendo a propriedade `memora.ia.provider`
(`MOCK` | `GEMINI` | `GROQ` | `OPENROUTER`) — com fallback automático para
`MOCK` caso o valor configurado não seja reconhecido.

---

## 🛠️ Tecnologias

| Tecnologia | Por que foi escolhida |
|---|---|
| **Java 21** | LTS mais recente no momento do início do projeto; usado com sintaxe moderna (`record`s para DTOs). |
| **Spring Boot 3.3.4** | Produtividade e ecossistema maduro para um monolito modular bem estruturado. |
| **Spring Security + JWT (jjwt)** | Autenticação stateless, sem sessão armazenada no servidor, com suporte a cookie `HttpOnly` e header `Bearer`. |
| **Spring Data JPA / Hibernate** | Mapeamento objeto-relacional produtivo, com `ddl-auto: validate` garantindo que o schema seja sempre o definido pelas migrations. |
| **Flyway** | Versionamento explícito e auditável do schema (11 migrations), essencial em um banco com 22 tabelas relacionadas. |
| **MySQL 8** | Banco relacional robusto, com suporte completo a `utf8mb4` e às constraints de integridade usadas no schema. |
| **Lombok** | Redução de boilerplate (construtores, getters/setters) mantendo as entidades legíveis. |
| **MapStruct** | Mapeamento entidade → DTO gerado em tempo de compilação, sem custo de reflexão em runtime. |
| **Bean Validation** | Validação declarativa nos `record`s de entrada das APIs. |
| **springdoc-openapi** | Documentação interativa (Swagger UI) gerada automaticamente a partir dos Controllers. |
| **Spring WebFlux (WebClient)** | Cliente HTTP reativo usado exclusivamente pelos providers de IA para chamar Gemini/Groq/OpenRouter. |
| **Thymeleaf** | Renderização server-side da casca de cada página, sem exigir build step de Node.js. |
| **JavaScript puro** | Busca de dados via `fetch` e renderização de DOM, sem framework e sem bundler. |
| **HTMX** | Disponível via CDN para swaps parciais de HTML quando faz mais sentido que manipulação manual de DOM. |
| **Bootstrap 5** | Utilitários pontuais de grid/espaçamento — a identidade visual principal é um design system próprio (`*-memora`) sobre o Bootstrap. |
| **Chart.js** | Biblioteca de gráficos usada na página de Estatísticas. |
| **PWA** (manifest + service worker) | Instalação na tela inicial do celular como app standalone, com cache-first para estáticos. |
| **Docker / Docker Compose** | Empacotamento reprodutível em build multi-stage e orquestração com MySQL, sem configuração manual. |

---

## 🔐 Segurança

| Mecanismo | Detalhe de implementação |
|---|---|
| **JWT** | Geração e validação via `jjwt`, com `JwtService` central assinando com HMAC-SHA256. |
| **Cookie HttpOnly** | O token é entregue em um cookie `HttpOnly` (`memora_token`) — inacessível a JavaScript, neutralizando roubo de sessão via XSS. |
| **Suporte a Bearer Token** | O mesmo `JwtAuthFilter` também aceita `Authorization: Bearer`, permitindo uso como API pura por clientes externos. |
| **Spring Security stateless** | `SessionCreationPolicy.STATELESS` — nenhuma sessão HTTP tradicional; toda autenticação é resolvida a cada requisição pelo filtro JWT. |
| **BCrypt** | Toda senha é armazenada com hash `BCryptPasswordEncoder` — nunca em texto puro. |
| **Rotas protegidas por padrão** | `anyRequest().authenticated()` — apenas uma lista explícita de rotas públicas (login, registro, estáticos, Swagger, `/api/auth/**`) é liberada. |
| **Resposta de erro contextual** | `ApiAwareAuthEntryPoint` devolve **401 JSON** para chamadas de API (`/api/**` ou header `HX-Request`) e **redirect para `/login`** para navegação normal de página. |
| **CORS configurado explicitamente** | Origens, métodos e headers liberados via `CorsConfigurationSource` dedicado no `SecurityConfig`. |

---

## 🗄️ Banco de Dados

Schema **100% gerenciado por Flyway** — o Hibernate roda com
`ddl-auto: validate`, ou seja, nunca cria ou altera tabelas, apenas confere
se as entidades batem com o schema já aplicado. Todas as tabelas usam
`utf8mb4_unicode_ci` / `InnoDB`.

**22 tabelas** distribuídas em **11 migrations** (V1 a V11):

| Migration | Conteúdo |
|---|---|
| V1 | `usuarios` — autenticação e perfil |
| V2 | `user_progress`, `streaks`, `achievements` — núcleo da gamificação |
| V3 | `pet_status` — humor e evolução da Leia |
| V4 | `notes` — anotações de estudo |
| V5 | `quizzes`, `quiz_questions`, `quiz_answers`, `quiz_attempts` |
| V6 | `study_plans`, `study_plan_items` |
| V7 | `events` — calendário acadêmico |
| V8 | `focus_sessions` — Modo Foco |
| V9 | `daily_missions` |
| V10 | `cosmetic_items`, `background_themes`, `user_inventory`, `purchase_history` — Loja, com seed de 10 cosméticos + 6 cenários |
| V11 | `gardens`, `user_plants` — Jardim |

**Convenções**: toda PK é `CHAR(36)` (UUID gerado pela aplicação); toda FK
para `usuarios` tem `ON DELETE CASCADE`; entidades que estendem
`BaseEntity` têm `criado_em`/`atualizado_em` automáticos via
`@CreatedDate`/`@LastModifiedDate`.

Documentação completa do schema, com todos os campos e relacionamentos, em
[`DATABASE.md`](./DATABASE.md).

---

## 📱 Mobile First

A interface foi desenhada a partir de um viewport de smartphone como base,
não como um ajuste posterior de uma versão desktop:

- **Bottom-nav + drawer** substituem a sidebar tradicional em telas
  pequenas — destinos fixos sempre visíveis, mais um menu deslizante
  completo aberto pelo botão de menu da topbar.
- A sidebar tradicional só aparece em telas largas, quando bottom-nav e
  drawer são escondidos.
- Alvos de toque generosos, seguindo diretrizes de acessibilidade de toque.
- Inputs com `font-size: 16px`, evitando o zoom automático do Safari iOS ao
  focar um campo.
- Respeito à `safe-area-inset-bottom` na navegação inferior, para telas com
  home indicator.

---

## 📲 PWA

A aplicação é instalável como app independente a partir do navegador:

| Peça | Função |
|---|---|
| `manifest.json` | Define nome (`Memora — Leia Edition`), ícones e modo de exibição `standalone`. |
| `sw.js` (Service Worker) | Estratégia **cache-first** para arquivos estáticos (CSS, JS, ícones) e **network-only** para todas as chamadas `/api/**`, garantindo que dados de gamificação nunca fiquem desatualizados por cache. |
| Ícones | 192px e 512px, referenciados no manifest. |

> 💬 O suporte offline é limitado aos recursos estáticos (cache-first) — não
> há fila de ações offline para sincronização posterior das chamadas de API.

---

## 🚀 Como executar

### Pré-requisitos
- Java 21
- Maven
- MySQL 8 **ou** Docker

### Opção 1 — Docker (recomendado, zero configuração)

```bash
git clone <url-do-repositorio>
cd StudyLeia
docker compose up --build
```

Isso sobe dois containers: `mysql` (com volume persistente e healthcheck) e
`app` (aguarda o MySQL ficar saudável antes de iniciar). Todas as variáveis
de ambiente já têm um valor padrão funcional. Acesse:

```
http://localhost:8080
```

Para customizar qualquer variável (chave de IA, SMTP, senha do MySQL),
copie `.env.example` para `.env` e edite os valores.

### Opção 2 — Local (MySQL próprio / XAMPP)

```bash
git clone <url-do-repositorio>
cd StudyLeia
mvn spring-boot:run
```

A URL do datasource em `application.yml` já usa
`createDatabaseIfNotExist=true`, e o Flyway cria todas as tabelas
automaticamente na primeira execução.

```bash
# se o MySQL tiver senha de root definida:
export DB_PASSWORD=sua_senha
mvn spring-boot:run
```

### Variáveis de ambiente principais

| Variável | Padrão | Descrição |
|---|---|---|
| `DB_PASSWORD` | _(vazio)_ | Senha do MySQL local |
| `JWT_SECRET` | chave de exemplo no `.env.example` | Chave de assinatura do JWT — **trocar em produção** |
| `MEMORA_IA_PROVIDER` | `MOCK` | `MOCK` \| `GEMINI` \| `GROQ` \| `OPENROUTER` |
| `GEMINI_API_KEY` / `GROQ_API_KEY` / `OPENROUTER_API_KEY` | _(vazio)_ | Chave do provider de IA escolhido |
| `MAIL_HOST` / `MAIL_PORT` / `MAIL_USERNAME` / `MAIL_PASSWORD` | `smtp.gmail.com` / `587` / vazio | SMTP para recuperação de senha por e-mail |
| `APP_BASE_URL` | `http://localhost:8080` | URL base usada em links gerados pela aplicação |

Por padrão, o provider de IA é **MOCK** — gera quizzes e planos de estudo
localmente, sem nenhuma chave de API necessária. Para usar IA real:

```bash
MEMORA_IA_PROVIDER=GEMINI GEMINI_API_KEY=sua-chave docker compose up
```

### Documentação da API

Com a aplicação rodando:

```
http://localhost:8080/swagger-ui.html
```

### Executando os testes

```bash
mvn test
```

---

## 📂 Estrutura do Projeto

```
StudyLeia/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── README.md               este arquivo
├── ARCHITECTURE.md          decisões técnicas e fluxos detalhados
├── DATABASE.md              schema completo do banco
├── PROJECT_STATUS.md        status real de conclusão e pendências
└── src/
    ├── main/
    │   ├── java/com/memora/
    │   │   ├── auth/                cadastro, login, perfil
    │   │   ├── calendar/            eventos e alertas
    │   │   ├── common/              BaseEntity e utilitários
    │   │   ├── config/              configuração geral
    │   │   │   └── security/        JWT, Spring Security
    │   │   ├── cosmetic/            catálogo de cosméticos
    │   │   ├── background/          catálogo de cenários
    │   │   ├── dailymission/        missões diárias
    │   │   ├── dashboard/           agregador da tela inicial
    │   │   ├── exception/           exceções + handler global
    │   │   ├── focus/               modo foco (Pomodoro)
    │   │   ├── gamification/        XP, nível, moedas, streak, conquistas
    │   │   ├── garden/              jardim
    │   │   ├── integration/ai/      provedores de IA desacoplados
    │   │   │   ├── provider/        Mock · Gemini · Groq · OpenRouter
    │   │   │   └── service/         orquestração de geração de quiz/plano
    │   │   ├── notes/               anotações
    │   │   ├── pet/                 humor e evolução da Leia
    │   │   ├── quiz/                quizzes
    │   │   ├── shop/                loja
    │   │   ├── statistics/          métricas agregadas
    │   │   └── studyplan/           planos de estudo
    │   └── resources/
    │       ├── application.yml             configuração base
    │       ├── application-dev.yml         logs verbosos
    │       ├── application-prod.yml        logs discretos (Docker)
    │       ├── application-test.yml        H2 em memória, para testes
    │       ├── db/migration/               11 migrations Flyway (V1–V11)
    │       ├── templates/                  23 páginas Thymeleaf
    │       │   ├── auth/ · calendar/ · focus/ · fragments/
    │       │   ├── gamification/ · garden/ · notes/ · pet/
    │       │   └── quiz/ · shop/ · statistics/ · studyplan/
    │       └── static/
    │           ├── css/                    memora.css (design system) + leia.css (mascote)
    │           ├── js/                     memora.js, leia-accessories.js, pwa-register.js
    │           ├── img/
    │           ├── manifest.json
    │           └── sw.js
    └── test/java/com/memora/               testes JUnit 5 + Mockito
```

---

## 🛣️ Roadmap

### ✅ Concluído
- 18 módulos de domínio funcionalmente completos
- 22 tabelas / 11 migrations Flyway com seed inicial de loja
- Autenticação JWT em cookie `HttpOnly` + suporte a Bearer token
- Sistema de gamificação centralizado (XP, nível, moedas, streak, 12 conquistas)
- Mascote Leia em SVG/CSS puro, 5 humores × 5 estágios de evolução
- Loja, Jardim, Quiz, Plano de Estudos, Calendário, Modo Foco, Missões Diárias, Estatísticas
- Camada de IA desacoplada com 4 providers (Mock + Gemini + Groq + OpenRouter)
- 5 jobs agendados de automação em background
- Interface mobile-first (bottom-nav + drawer) com 23 templates
- PWA instalável (manifest + service worker)
- Docker multi-stage + Docker Compose, prontos para `up --build` sem configuração manual
- 7 suítes de teste unitário (JUnit 5 + Mockito) cobrindo as regras de negócio mais críticas

### 🔧 Em desenvolvimento / polimento
- Cenários de fundo da Leia ainda são um valor de gradiente CSS aplicado ao
  container principal — não elementos gráficos animados e interativos por
  ambiente (evolução já desenhada, ver Futuras versões)
- Validação de e-mail real de recuperação de senha (sem SMTP configurado, o
  token de recuperação fica apenas registrado em log)

### 🔭 Futuras versões
- Cenários vivos por ambiente (elementos SVG próprios, animações contínuas e
  pequenas interações por cenário, mantendo a Leia sempre em primeiro plano)
- Calendário em formato de grid visual de mês (hoje é uma lista cronológica)
- Testes de integração `@SpringBootTest` ponta a ponta
- Internacionalização (hoje todo o texto é fixo em português, por escopo)
- Fila de sincronização offline para o Service Worker

> Detalhamento completo de cada pendência em [`PROJECT_STATUS.md`](./PROJECT_STATUS.md).

---

## 📸 Screenshots

| Tela | Preview |
|---|---|
| Dashboard | _[screenshot a adicionar]_ |
| A Leia | _[screenshot a adicionar]_ |
| Loja | _[screenshot a adicionar]_ |
| Jardim | _[screenshot a adicionar]_ |
| Quiz | _[screenshot a adicionar]_ |
| Estatísticas | _[screenshot a adicionar]_ |

---

## 📊 Estatísticas do Projeto

| Métrica | Quantidade |
|---|---|
| Módulos de domínio | 18 |
| Arquivos Java (`src/main`) | 162 |
| Controllers | 14 |
| Services | 17 |
| Repositories | 21 |
| Entidades JPA | 22 |
| Enums de domínio | 15 |
| DTOs (`record`) | 42 |
| Endpoints REST (`@*Mapping`) | 70 |
| Templates Thymeleaf | 23 |
| Migrations Flyway | 11 |
| Tabelas no banco | 22 |
| Jobs agendados (`@Scheduled`) | 5 |
| Providers de IA implementados | 4 |
| Classes de teste (JUnit 5 + Mockito) | 7 |

---

## 💎 Diferenciais Técnicos

- **Gamificação como serviço único**, não espalhada — um único método
  orquestra XP, nível, humor da Leia, streak, conquistas e eventos de
  domínio, eliminando duplicação de regra entre os módulos que concedem
  recompensa.
- **Acoplamento zero entre módulos via eventos de domínio** — o Jardim
  reage a ganhos de XP sem que o módulo de gamificação conheça sua
  existência, usando `ApplicationEventPublisher`/`@EventListener`.
- **Camada de IA 100% substituível por configuração** — trocar entre Mock,
  Gemini, Groq e OpenRouter é uma única variável de ambiente
  (`memora.ia.provider`), sem alterar nenhum Service de domínio.
- **Segurança consistente entre SSR e API** — o mesmo `SecurityConfig` e
  filtro JWT atendem páginas Thymeleaf (cookie `HttpOnly`) e chamadas REST
  (`Authorization: Bearer`), com um `AuthenticationEntryPoint` que decide
  401 JSON ou redirect conforme o tipo de requisição.
- **Schema auditável por design** — `ddl-auto: validate` torna impossível
  o Hibernate alterar silenciosamente o banco; toda mudança de schema passa
  obrigatoriamente por uma migration Flyway versionada.
- **Mascote sem dependência de assets externos** — a Leia inteira (5
  humores × 5 estágios, com overlay de acessórios) é SVG/CSS, tornando o
  produto leve e a arte versionável como código.
- **Mobile-first verificado, não presumido** — bottom-nav dedicada, alvos
  de toque generosos, `font-size:16px` em inputs e `safe-area-inset`
  tratados explicitamente para uso real em smartphones.
- **Documentação técnica viva** — `ARCHITECTURE.md`, `DATABASE.md` e
  `PROJECT_STATUS.md` mantidos como parte do repositório, com decisões de
  design documentadas.

---

## 👨‍💻 Autor

Projeto pessoal construído para praticar arquitetura de software de ponta a
ponta: modelagem de domínio, segurança stateless com JWT, banco relacional
versionado com Flyway e uma stack majoritariamente Java + JavaScript puro
no frontend, sem build step de Node.js.

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)]()
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)]()

</div>

---

<div align="center">

<sub>Feito com 🐾 — StudyLeia</sub>

</div>
