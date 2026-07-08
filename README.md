<div align="center">

# 🐾 StudyLeia


<!-- 🎬 GIF de demonstração — substitua este banner estático pelo GIF real quando tiver gravado -->
<img src="./assets/Banner.gif" alt="StudyLeia — gamifique seus estudos, evolua todos os dias" width="30%" />

<br />

[![Java](https://img.shields.io/badge/Java-21-007396?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Flyway](https://img.shields.io/badge/Flyway-11%20migrations-CC0200?style=for-the-badge&logo=flyway&logoColor=white)](https://flywaydb.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Mobile First](https://img.shields.io/badge/Mobile-First-FF6B6B?style=for-the-badge&logo=mobile&logoColor=white)](#-mobile-first)

[![License](https://img.shields.io/badge/license-Privado-lightgrey?style=flat-square)]()
[![Status](https://img.shields.io/badge/status-~90%25%20conclu%C3%ADdo-yellow?style=flat-square)](#-roadmap)
[![Java Files](https://img.shields.io/badge/Java%20files-162-blue?style=flat-square)]()
[![Tests](https://img.shields.io/badge/testes-JUnit%205%20%2B%20Mockito-25A162?style=flat-square)]()

**StudyLeia** é uma plataforma de estudos gamificada onde cada quiz respondido,
cada anotação criada e cada sessão de foco concluída alimenta o progresso da
usuária **e** a felicidade da sua mascote virtual, a gatinha **Leia**.

[💌 A história](#-a-história-por-trás-do-projeto) · [📖 Arquitetura](#-arquitetura) · [🚀 Como executar](#-como-executar) · [🛣️ Roadmap](#-roadmap)

</div>

---

## 💌 A história por trás do projeto

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

## 📌 Sobre o projeto

Manter uma rotina de estudos consistente é, na prática, um problema de
**motivação contínua** — não de falta de ferramentas para anotar, planejar ou
testar conhecimento. Existem dezenas de apps de notas e de flashcards; o que
falta é um motivo emocional para abrir o app de novo amanhã.

O **StudyLeia** ataca esse problema unindo três ingredientes em uma única
experiência coesa:

- 🎮 **Gamificação real**, não cosmética — XP, nível, moedas, streak e
  conquistas conectados a uma fórmula de progressão única, e não a números
  soltos espalhados pela interface;
- 🐱 **Uma mascote com estado persistente** — a Leia tem humor e estágio de
  evolução que reagem diretamente ao comportamento de estudo da usuária,
  criando um vínculo afetivo que widgets de progresso tradicionais não geram;
- 🧠 **Ferramentas de estudo de verdade** — quizzes (manuais ou gerados por
  IA), planos de estudo com cronograma, calendário de provas, modo foco
  (Pomodoro) e um painel de estatísticas, todos como fonte de XP da Leia.

A motivação do projeto nasceu da observação simples de que cuidar de algo
gera consistência — o mesmo princípio por trás de jogos como *Tamagotchi* e
*Duolingo*, aqui aplicado a hábitos de estudo reais e a uma gata real.

---

## 🎬 Demonstração

O banner no topo já mostra a cara da aplicação. Espaço reservado para o
restante do material de demonstração oficial:

| | |
|---|---|
| 🎥 **Vídeo** | _[link para o vídeo de demonstração — a adicionar]_ |
| 🖼️ **GIF** | _[GIF de navegação fim a fim — a adicionar]_ |

---

## ✨ Funcionalidades

O produto é organizado em **18 módulos de domínio** no backend, todos
expostos através de páginas Thymeleaf funcionais — não há nenhuma rota
"em construção".

### 🏠 Dashboard
Tela inicial que agrega, em uma única leitura, o estado atual da Leia, o
progresso de gamificação (XP, nível, moedas, streak), as missões diárias em
andamento e os próximos eventos do calendário.

### 🐾 Leia (mascote virtual)
Painel dedicado à interação com a Leia: visualização do humor e estágio de
evolução atuais, carinho manual, e os cosméticos/cenário equipados. Ver a
seção [A Leia](#-a-leia) para os detalhes de design.

### 🏆 Gamificação
Painel de conquistas (*achievements*) desbloqueadas e em progresso, streak
atual e recorde de sequência de dias estudados. Ver a seção
[Gamificação](#-gamificação) para o detalhamento completo do sistema.

### 🛍️ Loja
Catálogo combinado de **cosméticos** (laços, óculos, chapéus, gravatas e
acessórios especiais para a Leia) e **cenários de fundo**, com sistema de
raridade (Comum / Rara / Épica / Lendária), compra com moedas, equipagem e
histórico de compras.

### 🌱 Jardim
Mecânica paralela de cultivo: a usuária planta sementes (ganhas ao estudar)
em vasos, e cada planta cresce com base em uma combinação de **tempo
decorrido + XP ganho + metas concluídas** desde o plantio — recompensando
tanto consistência quanto volume de estudo.

### 📅 Plano de Estudos
Geração de cronogramas de estudo via IA a partir de matéria, data da prova e
horas disponíveis por dia, decompostos em itens individuais
(Estudo / Revisão / Simulado) que podem ser marcados como concluídos um a
um — o plano só fecha como concluído quando todos os itens estiverem feitos.

### 📝 Quiz
Criação manual de quizzes ou geração automática via IA a partir de um tema.
Fluxo de resposta gamificado, com XP por questão correta, XP de bônus por
completar o quiz inteiro, e registro de cada tentativa para as estatísticas
de desempenho por matéria.

### 🍅 Modo Foco
Sessões de Pomodoro (foco/pausa) com timer no frontend; cada sessão
concluída é registrada e gera XP e moedas.

### 🎯 Missões Diárias
Quatro tipos de missão (responder 10 questões, criar 1 anotação, estudar 30
minutos, completar o plano do dia) geradas automaticamente todo dia para
cada usuária ativa, com meta e recompensa próprias.

### 🗓️ Calendário
Registro de eventos acadêmicos (provas, trabalhos, apresentações,
lembretes) com alerta automático para eventos nas próximas 48 horas.

> 💬 **Nota de transparência**: a página atual é uma lista cronológica de
> eventos, não um grid visual de mês — atende ao escopo definido, mas um
> calendário visual completo é uma evolução de UX natural e está listado no
> [Roadmap](#-roadmap).

### 📊 Estatísticas
Painel com gráficos (Chart.js) de XP ao longo do tempo, taxa de acerto por
matéria e atividade geral, consumindo os dados agregados de quizzes, notas,
planos e sessões de foco.

### 📓 Anotações
CRUD simples de notas de estudo com tags, cada criação gerando XP.

### 👤 Perfil & Autenticação
Cadastro, login, logout, recuperação de senha (token por e-mail) e edição
de perfil (nome, nome da pet, cor do tema). Sessão mantida via JWT em cookie
`HttpOnly` — ver a seção [Segurança](#-segurança).

---

## 🐱 A Leia

A Leia não é um avatar estático — ela é o **indicador emocional do progresso
da usuária**, renderizada inteiramente em SVG/CSS, sem nenhuma dependência
de imagem externa.

| Aspecto | Como funciona |
|---|---|
| **Humor** | 5 estados — `TRISTE`, `ENTEDIADA`, `NEUTRA`, `FELIZ`, `SUPER_FELIZ` — que sobem a cada recompensa de gamificação e decaem automaticamente por inatividade (job a cada 6h). |
| **Evolução** | 5 estágios visuais atrelados ao nível da conta — `FILHOTE` (níveis 1–4), `JOVEM` (5–9), `ADULTA` (10–19), `SÁBIA` (20–29) e `RAINHA LEIA` (30+). |
| **Animações** | Respiração contínua, piscar, balanço de rabo, e reações pontuais de "ganhou XP" e "surpresa" disparadas em tempo real pelas ações da usuária. |
| **Interação** | Carinho manual (toque/clique) registrado como interação, junto com um contador de carinhos totais recebidos. |
| **Personalização** | Overlay de cosméticos equipados (laço, óculos, chapéu, gravata, acessório especial) e cenário de fundo, ambos comprados na Loja. |
| **Papel na plataforma** | Funciona como o "termômetro" emocional de toda a gamificação — em vez de só olhar uma barra de XP, a usuária olha para a Leia e sente, visualmente, se está cuidando bem da sua rotina de estudos. |

A combinação de 5 humores × 5 estágios é resolvida por uma única API de
exibição (`mascote(humor, estagio, tamanho)`), o que permite trocar a arte
visual no futuro editando apenas `fragments/leia.html` e `static/css/leia.css`
— sem tocar em nenhuma regra de negócio do backend.

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
automaticamente por um job diário (00:05) caso a usuária passe um dia
inteiro sem nenhuma atividade gamificável.

### Conquistas (Achievements)

12 conquistas com regra de desbloqueio própria, verificadas a cada
atividade relevante: primeira prova, sequência de 7 e 30 dias, 100 questões
respondidas, 1.000 e 5.000 XP, primeira anotação, primeiro plano concluído,
10 quizzes criados, e níveis 10 / 20 / 30.

### Missões diárias

4 tipos com meta própria, geradas automaticamente todo dia (00:01) para
cada usuária ativa: responder 10 questões, criar 1 anotação, estudar 30
minutos, completar o plano do dia.

### Recompensas em cadeia

Conceder XP a uma atividade dispara, em um único fluxo: atualização do
placar de progresso → recálculo de nível → atualização de humor/evolução da
Leia → registro de streak → verificação de conquistas → publicação de um
evento de domínio (consumido pelo Jardim para creditar sementes) → resposta
única usada pelo frontend para decidir toasts, confete e badges.

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
| `controller/` | Recebe a requisição, delega 100% ao Service, devolve `ResponseEntity` — **nunca** contém regra de negócio. |
| `service/` | Regra de negócio, `@Transactional`, validação de propriedade do recurso. |
| `repository/` | Interfaces Spring Data JPA. |
| `entity/` | Entidades JPA (PK `UUID`, FKs `LAZY`, `BaseEntity` para timestamps automáticos). |
| `dto/` | `record`s de entrada/saída com Bean Validation. |
| `mapper/` | Interfaces MapStruct para mapeamento 1:1 entidade → DTO. |

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
(`RecompensaConcedidaEvent`, publicado via `ApplicationEventPublisher` e
consumido via `@EventListener`) — o padrão de referência para qualquer
futura reação a recompensa.

### Automação em background

5 jobs `@Scheduled`, cada um delegando a lógica real ao Service do módulo
correspondente:

| Job | Frequência | Função |
|---|---|---|
| `PetDecaySchedulerJob` | a cada 6h | Decai o humor da Leia por inatividade |
| `StreakSchedulerJob` | 00:05 diário | Quebra sequências de quem não estudou no dia anterior |
| `CalendarAlertSchedulerJob` | a cada 1h | Marca eventos das próximas 48h como notificados |
| `DailyMissionSchedulerJob` | 00:01 diário | Gera as missões do dia de cada usuária ativa |
| `GardenSchedulerJob` | a cada 3h | Recalcula o crescimento de todas as plantas |

A geração "lazy" (no primeiro acesso do dia) continua existindo em paralelo
a cada job, como rede de segurança.

### Camada de IA desacoplada

```
Controller → Service de domínio → Service de IA → interface AIProvider → implementação concreta
```

4 implementações de `AIProvider` (`MockAIProvider`, `GeminiAIProvider`,
`GroqAIProvider`, `OpenRouterAIProvider`), escolhidas em runtime por uma
única propriedade (`memora.ia.provider`), com fallback automático para
`MOCK` — nenhum outro ponto do sistema conhece o provider ativo.

---

## 🛠️ Tecnologias

| Tecnologia | Por que foi escolhida |
|---|---|
| **Java 21** | LTS mais recente no momento do início do projeto; usado com sintaxe moderna (`record`s para DTOs). |
| **Spring Boot 3.3.4** | Produtividade e ecossistema maduro para um monolito modular bem estruturado. |
| **Spring Security + JWT** | Autenticação stateless, sem necessidade de armazenar sessão no servidor, com suporte nativo a cookie `HttpOnly` e header `Bearer`. |
| **Spring Data JPA / Hibernate** | Mapeamento objeto-relacional produtivo, com `ddl-auto: validate` garantindo que o schema seja sempre o definido pelas migrations — nunca gerado automaticamente. |
| **Flyway** | Versionamento explícito e auditável do schema (11 migrations), essencial em um banco com 22 tabelas relacionadas. |
| **MySQL 8** | Banco relacional robusto, com suporte completo a `utf8mb4` e às constraints de integridade usadas no schema. |
| **Lombok** | Redução de boilerplate (construtores, getters/setters) mantendo as entidades legíveis. |
| **MapStruct** | Mapeamento entidade → DTO gerado em tempo de compilação, sem custo de reflexão em runtime. |
| **Bean Validation** | Validação declarativa nos `record`s de entrada das APIs. |
| **springdoc-openapi** | Documentação interativa (Swagger UI) gerada automaticamente a partir dos Controllers. |
| **Thymeleaf** | Renderização server-side da casca de cada página, sem exigir build step de Node.js. |
| **JavaScript puro** | Busca de dados via `fetch` e renderização de DOM, sem framework e sem bundler — toda a stack roda só com Java no backend. |
| **HTMX** | Disponível via CDN para swaps parciais de HTML quando fizer mais sentido que manipulação manual de DOM. |
| **Bootstrap 5** | Utilitários pontuais de grid/espaçamento — a identidade visual principal é um design system próprio (`*-memora`) sobre o Bootstrap. |
| **Chart.js** | Biblioteca de gráficos usada exclusivamente na página de Estatísticas. |
| **PWA** (manifest + service worker) | Instalação na tela inicial do celular como app standalone, com cache-first para estáticos. |
| **Docker / Docker Compose** | Empacotamento reprodutível em build multi-stage e orquestração com MySQL, sem nenhuma configuração manual. |

---

## 🔐 Segurança

| Mecanismo | Detalhe de implementação |
|---|---|
| **JWT** | Geração e validação via `jjwt`, com `JwtService` central. Token carrega a identidade da usuária autenticada. |
| **Cookie HttpOnly** | O token é entregue em um cookie `HttpOnly` (`memora_token`) — inacessível a JavaScript, o que neutraliza roubo de sessão via XSS, mesmo em caso de script malicioso injetado na página. |
| **Suporte a Bearer Token** | O mesmo `JwtAuthFilter` também aceita `Authorization: Bearer`, permitindo uso como API pura por clientes externos, se necessário. |
| **Spring Security stateless** | `SessionCreationPolicy.STATELESS` — nenhuma sessão HTTP tradicional; toda autenticação é resolvida a cada requisição pelo filtro JWT. |
| **BCrypt** | Toda senha é armazenada com hash `BCryptPasswordEncoder` — nunca em texto puro. |
| **Rotas protegidas por padrão** | `anyRequest().authenticated()` — apenas uma lista explícita de rotas públicas (login, registro, estáticos, Swagger) é liberada; todo o resto exige token válido. |
| **Resposta de erro contextual** | `ApiAwareAuthEntryPoint` devolve **401 JSON** para chamadas de API (`/api/**` ou header `HX-Request`) e **redirect para `/login`** para navegação normal de página — a mesma configuração de segurança serve API e SSR sem duplicação de regras. |
| **Validação de propriedade** | Toda operação de escrita sobre um recurso de outro usuário lança `AcessoNegadoException` antes de qualquer alteração. |
| **Tratamento de erro centralizado** | `GlobalExceptionHandler` único cobre todas as exceções de negócio da aplicação, incluindo casos específicos como `MoedasInsuficientesException` (HTTP 402) na Loja. |

---

## 🗄️ Banco de Dados

Schema **100% gerenciado por Flyway** — o Hibernate roda com
`ddl-auto: validate`, ou seja, nunca cria ou altera tabelas, apenas confere
se as entidades batem com o schema já aplicado. Todas as tabelas usam
`utf8mb4_unicode_ci` / `InnoDB`.

**22 tabelas** distribuídas em **11 migrations** (V1 a V11):

| Migration | Tabelas | Conteúdo |
|---|---|---|
| V1 | `usuarios` | Autenticação e perfil |
| V2 | `user_progress`, `streaks`, `achievements` | Núcleo da gamificação |
| V3 | `pet_status` | Humor e evolução da Leia |
| V4 | `notes` | Anotações de estudo |
| V5 | `quizzes`, `quiz_questions`, `quiz_answers`, `quiz_attempts` | Sistema de quiz |
| V6 | `study_plans`, `study_plan_items` | Planos de estudo |
| V7 | `events` | Calendário acadêmico |
| V8 | `focus_sessions` | Sessões de Modo Foco |
| V9 | `daily_missions` | Missões diárias |
| V10 | `cosmetic_items`, `background_themes`, `user_inventory`, `purchase_history` | Loja (com seed de 10 cosméticos + 6 cenários) |
| V11 | `gardens`, `user_plants` | Jardim |

**Convenções**: toda PK é `CHAR(36)` (UUID gerado pela aplicação); toda FK
para `usuarios` tem `ON DELETE CASCADE`; entidades que estendem
`BaseEntity` têm `criado_em`/`atualizado_em` automáticos via
`@CreatedDate`/`@LastModifiedDate`; registros imutáveis (`Achievement`,
`PurchaseHistory`, `UserInventory`, `UserPlant`, `QuizAttempt`,
`FocusSession`) usam apenas um timestamp via `@PrePersist`.

> 💬 **Decisão deliberada de modelagem**: não existe constraint única em
> `(garden_id, posicao_vaso)`. Isso é intencional — após a colheita, a
> planta permanece na tabela como histórico, liberando o vaso para um novo
> plantio. A regra "só uma planta ativa por vaso" é garantida na camada de
> aplicação (`GardenService`), não no banco.

Documentação completa do schema, com todos os campos e relacionamentos, em
[`DATABASE.md`](./DATABASE.md).

---

## 📱 Mobile First

A interface foi desenhada a partir do **iPhone 14 (390px lógicos)** como
base, não como um ajuste posterior de uma versão desktop:

- **Bottom-nav + drawer** substituem a sidebar tradicional abaixo de
  `992px` — 5 destinos fixos sempre visíveis, mais um menu deslizante
  completo aberto pelo botão "Mais" ou pelo ☰ da topbar.
- A sidebar tradicional só aparece em telas `≥992px`, quando bottom-nav e
  drawer são escondidos.
- **Zero scroll horizontal** em qualquer página.
- Alvos de toque com no mínimo **44px**, seguindo as diretrizes de
  acessibilidade de toque.
- Inputs com `font-size: 16px`, evitando o zoom automático do Safari iOS ao
  focar um campo.
- `padding-bottom: env(safe-area-inset-bottom)` na bottom-nav, respeitando
  a home indicator do iPhone.

---

## 📲 PWA

A aplicação é instalável como app independente a partir do navegador:

| Peça | Função |
|---|---|
| `manifest.json` | Define nome, ícones e modo de exibição `standalone` da aplicação instalada. |
| `sw.js` (Service Worker) | Estratégia **cache-first** para arquivos estáticos (CSS, JS, ícones) e **network-only** para todas as chamadas `/api/**`, garantindo que dados de gamificação nunca fiquem desatualizados por cache. |
| Ícones | Gerados a partir da arte da Leia, nos tamanhos exigidos pelo manifest (192px, 512px). |

**Instalação no iPhone (Safari)**: abrir a URL da aplicação → tocar no
ícone de compartilhar → "Adicionar à Tela de Início". O app abre então em
modo standalone, sem a barra de endereço do Safari.

> 💬 O suporte offline é limitado aos recursos estáticos (cache-first) — não
> há fila de ações offline para sincronização posterior das chamadas de API.

---

## 🚀 Como executar

### Pré-requisitos
- Java 21
- Maven (ou usar o wrapper, se presente)
- MySQL 8 **ou** Docker

### Opção 1 — Docker (recomendado, zero configuração)

```bash
git clone <url-do-repositorio>
cd LeiaStudy
docker compose up --build
```

Isso sobe dois containers: `mysql` (com volume persistente e healthcheck) e
`app` (aguarda o MySQL ficar saudável antes de iniciar). Todas as variáveis
de ambiente já têm um valor padrão funcional. Acesse:

```
http://localhost:8080
```

Para customizar qualquer variável (chave de IA, SMTP, senha do MySQL),
copie `.env.example` para `.env` e edite os valores — o Compose lê esse
arquivo automaticamente.



### Backend + banco + phpMyAdmin (Docker Compose — recomendado)

```bash
docker compose up
```

> Rode este comando na **raiz do projeto** (onde está o `docker-compose.yml`), e **não** dentro da pasta `backend/`.

Isso sobe o **MySQL**, o **Backend (Spring Boot)**, o **Frontend (React)** e o **phpMyAdmin** juntos.

| Serviço | URL |
|---------|-----|
| Frontend (React) | http://localhost:5173 |
| Backend (API) | http://localhost:8080 |
| phpMyAdmin | http://localhost:8082 |
| MySQL (cliente externo) | localhost:3307 |


### Opção 2 — Local (MySQL próprio / XAMPP)

```bash
git clone <url-do-repositorio>
cd LeiaStudy
mvn spring-boot:run
```

A URL do datasource em `application.yml` já usa
`createDatabaseIfNotExist=true`, e o Flyway cria todas as tabelas
automaticamente na primeira execução — não é preciso criar o schema
manualmente.

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
localmente, sem nenhuma chave de API necessária.

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
LeiaStudy/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── README.md              este arquivo
├── ARCHITECTURE.md         decisões técnicas e fluxos detalhados
├── DATABASE.md             schema completo do banco
├── PROJECT_STATUS.md       status real de conclusão e pendências
└── src/
    ├── main/
    │   ├── java/com/memora/
    │   │   ├── auth/               cadastro, login, perfil
    │   │   ├── calendar/           eventos e alertas
    │   │   ├── common/             BaseEntity e utilitários
    │   │   ├── config/             configuração geral
    │   │   │   └── security/       JWT, Spring Security
    │   │   ├── cosmetic/           catálogo de cosméticos
    │   │   ├── background/         catálogo de cenários
    │   │   ├── dailymission/       missões diárias
    │   │   ├── dashboard/          agregador da tela inicial
    │   │   ├── exception/          exceções + handler global
    │   │   ├── focus/              modo foco (Pomodoro)
    │   │   ├── gamification/       XP, nível, moedas, streak, conquistas
    │   │   ├── garden/             jardim
    │   │   ├── integration/ai/     provedores de IA desacoplados
    │   │   ├── notes/              anotações
    │   │   ├── pet/                humor e evolução da Leia
    │   │   ├── quiz/               quizzes
    │   │   ├── shop/               loja
    │   │   ├── statistics/         métricas agregadas
    │   │   └── studyplan/          planos de estudo
    │   └── resources/
    │       ├── application.yml            configuração base
    │       ├── application-dev.yml        logs verbosos
    │       ├── application-prod.yml       logs discretos (Docker)
    │       ├── application-test.yml       H2 em memória, para testes
    │       ├── db/migration/              11 migrations Flyway (V1–V11)
    │       ├── templates/                 23 páginas Thymeleaf
    │       │   ├── auth/
    │       │   ├── calendar/
    │       │   ├── focus/
    │       │   ├── fragments/             layout, navegação, mascote
    │       │   ├── gamification/
    │       │   ├── garden/
    │       │   ├── notes/
    │       │   ├── pet/
    │       │   ├── quiz/
    │       │   ├── shop/
    │       │   ├── statistics/
    │       │   └── studyplan/
    │       └── static/
    │           ├── css/                   memora.css (design system) + leia.css (mascote)
    │           ├── js/                    memora.js + pwa-register.js
    │           ├── img/
    │           ├── manifest.json
    │           └── sw.js
    └── test/java/com/memora/              testes JUnit 5 + Mockito
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
- Camada de IA desacoplada com 4 providers (Mock + 3 reais)
- 5 jobs agendados de automação em background
- Interface mobile-first completa (bottom-nav + drawer) com 23 templates
- PWA instalável (manifest + service worker)
- Docker multi-stage + Docker Compose, prontos para `up --build` sem configuração manual
- 7 suítes de teste unitário (JUnit 5 + Mockito) cobrindo as regras de negócio mais críticas

### 🔧 Em desenvolvimento / polimento
- Validação de e-mail real de recuperação de senha (hoje, sem SMTP configurado, o token de recuperação fica apenas registrado em log)
- Refinamento da precisão da série temporal de XP nas Estatísticas (atualmente uma aproximação baseada em acertos/erros de quiz, sem tabela de histórico dedicada)

### 🔭 Futuras versões
- Tabela `xp_history` dedicada, para uma série temporal de XP exata
- Calendário em formato de grid visual de mês (hoje é uma lista cronológica)
- Testes de integração `@SpringBootTest` ponta a ponta
- Internacionalização (hoje todo o texto é fixo em português, por escopo)
- Fila de sincronização offline para o Service Worker

> Detalhamento completo de cada pendência em [`PROJECT_STATUS.md`](./PROJECT_STATUS.md).

---

## 📊 Estatísticas do Projeto

| Métrica | Quantidade |
|---|---|
| Módulos de domínio | 18 |
| Arquivos Java (`src/main`) | 162 |
| Controllers | 13 |
| Services | 17 |
| Repositories | 21 |
| Entidades JPA | 22 |
| Enums de domínio | 15 |
| DTOs (`record`) | 42 |
| Endpoints REST (`@*Mapping`) | ~70 |
| Templates Thymeleaf | 23 |
| Migrations Flyway | 11 |
| Tabelas no banco | 22 |
| Jobs agendados (`@Scheduled`) | 5 |
| Classes de teste (JUnit 5 + Mockito) | 7 |

---

## 💎 Diferenciais Técnicos

- **Gamificação como serviço único**, não espalhada — um único método
  orquestra XP, nível, humor da Leia, streak, conquistas e eventos de
  domínio, eliminando duplicação de regra entre os 8 módulos que concedem
  recompensa.
- **Acoplamento zero entre módulos via eventos de domínio** — o Jardim
  reage a ganhos de XP sem que o módulo de gamificação conheça sua
  existência, usando `ApplicationEventPublisher`/`@EventListener`.
- **Camada de IA 100% substituível por configuração** — trocar entre Mock,
  Gemini, Groq e OpenRouter é uma única variável de ambiente, sem alterar
  nenhum Service de domínio.
- **Segurança consistente entre SSR e API** — o mesmo `SecurityConfig` e
  filtro JWT atendem páginas Thymeleaf (cookie `HttpOnly`) e chamadas REST
  (`Authorization: Bearer`), com um `AuthenticationEntryPoint` que decide
  401 JSON ou redirect conforme o tipo de requisição.
- **Schema auditável por design** — `ddl-auto: validate` torna impossível
  o Hibernate alterar silenciosamente o banco; toda mudança de schema passa
  obrigatoriamente por uma migration Flyway versionada.
- **Mascote sem dependência de assets externos** — a Leia inteira (5
  humores × 5 estágios) é SVG/CSS, tornando o produto leve e a arte
  versionável como código.
- **Mobile-first verificado, não presumido** — breakpoint único, alvos de
  toque ≥44px, `font-size:16px` em inputs e `safe-area-inset` tratados
  explicitamente para o caso real de uso em iPhone.
- **Documentação técnica viva** — `ARCHITECTURE.md`, `DATABASE.md` e
  `PROJECT_STATUS.md` mantidos como parte do repositório, com decisões de
  design documentadas (inclusive as deliberadamente não implementadas, com
  a razão registrada).

---

## 👨‍💻 Autor

Criado para ajudar minha namorada a estudar para o vestibular — e, no
processo, para eu mesmo praticar arquitetura de software de ponta a ponta:
modelagem de domínio, segurança stateless com JWT, banco relacional
versionado e uma stack 100% Java + JavaScript puro no frontend, sem build
step de Node.js. Um projeto pessoal que virou peça de portfólio.

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)]()
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)]()

</div>

---

<div align="center">

<sub>Feito com 🐾 e muito café — StudyLeia, 2026</sub>

</div>
