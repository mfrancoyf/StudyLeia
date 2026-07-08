# ARCHITECTURE — Memora — Leia Edition

## 1. Visão geral

Aplicação monolítica Spring Boot, server-rendered (Thymeleaf) com
interatividade via JavaScript puro + HTMX, organizada em módulos de domínio
("package by feature", não "package by layer" no nível raiz). Cada módulo
tem internamente a separação clássica em camadas.

```
com.memora
├── auth/                  cadastro, login, perfil, recuperação de senha
├── config/                segurança (JWT, Spring Security), config geral
├── exception/             exceções de negócio + handler global
├── common/                BaseEntity e utilitários compartilhados
├── gamification/          XP, nível, moedas, streak, conquistas (orquestrador central)
├── pet/                   humor e evolução visual da Leia
├── notes/                 anotações de estudo
├── quiz/                  quizzes manuais e via IA
├── integration/ai/        camada desacoplada de provedores de IA
├── studyplan/             planos de estudo via IA
├── calendar/              eventos e alertas
├── focus/                 sessões de Modo Foco (Pomodoro)
├── dailymission/          missões diárias
├── dashboard/             agregador de leitura para a tela inicial
├── shop/                  catálogo combinado, compras, inventário
├── cosmetic/               catálogo de cosméticos (conteúdo estático)
├── background/             catálogo de cenários (conteúdo estático)
├── garden/                jardim: sementes, plantio, crescimento
└── statistics/            métricas agregadas (somente leitura)
```

Cada módulo de domínio segue, internamente:

```
modulo/
├── controller/    REST Controllers — sem regra de negócio
├── service/       regra de negócio, transacional
├── repository/    Spring Data JPA
├── entity/        entidades JPA
├── dto/           records de entrada/saída
└── mapper/        interfaces MapStruct (quando o mapeamento é 1:1 simples)
```

## 2. Por que "package by feature"

A alternativa clássica seria `com.memora.controller`, `com.memora.service`,
etc., com todas as classes de todos os domínios misturadas por camada. Para
um projeto deste tamanho (18 domínios), isso tornaria cada pacote enorme e
difícil de navegar. Agrupar por feature significa que abrir a pasta `quiz/`
mostra tudo que é preciso saber sobre quizzes, sem precisar pular entre
pacotes distantes.

## 3. Fluxo de uma requisição autenticada

```
Navegador
  │  Cookie HttpOnly "memora_token" (JWT) enviado automaticamente
  ▼
JwtAuthFilter (OncePerRequestFilter)
  │  Extrai o token do cookie OU header Authorization
  │  Valida e popula o SecurityContextHolder com o Usuario autenticado
  ▼
SecurityConfig (authorizeHttpRequests)
  │  Rotas /api/auth/**, estáticos, swagger → liberado
  │  Todo o resto → exige autenticação
  ▼
Controller (@RestController ou @Controller)
  │  UsuarioAutenticado.obter() lê o Usuario do contexto de segurança
  │  Delega 100% da lógica para o Service
  ▼
Service (@Transactional)
  │  Regra de negócio, validação de propriedade, chamadas a outros Services
  ▼
Repository (Spring Data JPA) → MySQL
```

Para chamadas de API que falham por falta de autenticação, o
`ApiAwareAuthEntryPoint` decide a resposta: JSON 401 se a rota for `/api/**`
ou tiver o header `HX-Request: true` (chamada HTMX); redirect para
`/login` se for navegação de página normal.

## 4. Por que JWT em cookie HttpOnly (e não localStorage)

- **HttpOnly** impede que JavaScript malicioso (XSS) leia o token — mesmo
  que um script consiga ser injetado na página, ele não consegue roubar a
  sessão.
- Cookies são enviados automaticamente pelo navegador em toda requisição,
  o que permite que as páginas Thymeleaf renderizadas no servidor (sem
  nenhum JS rodando ainda) já cheguem autenticadas — importante porque o
  `SecurityConfig` decide se a página é servida ou redirecionada para
  `/login` antes de qualquer HTML ser entregue.
- A mesma infraestrutura também aceita o header `Authorization: Bearer`
  (ver `JwtAuthFilter.extrairToken`), then o sistema funciona igualmente
  bem como API pura para clientes externos, se algum dia for necessário.

## 5. Gamificação como serviço central (e não espalhada)

Toda fonte de XP/moedas (responder quiz, criar nota, concluir plano,
sessão de foco, criar evento, missão diária) é declarada como um valor do
enum `TipoAtividade`, que já carrega o XP e as moedas correspondentes. Os
módulos de domínio nunca somam XP diretamente — eles sempre chamam:

```java
gamificationService.concederRecompensa(usuario, TipoAtividade.X);
```

Esse único método:
1. Soma XP e moedas ao `UserProgress`.
2. Recalcula o nível (`CalculadoraNivel`).
3. Atualiza o estágio de evolução da Leia (`PetService`).
4. Reage emocionalmente na Leia (`PetService.reagirAGanhoDeXp`).
5. Registra atividade no streak do dia (`StreakService`).
6. Verifica e concede conquistas (`AchievementService`).
7. Publica `RecompensaConcedidaEvent` (ver seção 6).
8. Devolve um `RecompensaResponse` único, consumido pelo frontend para
   decidir toasts, confete e animações.

Essa centralização é o que garante que as regras de pontuação fiquem
consistentes e fáceis de ajustar — mudar o valor de XP de uma atividade é
uma linha no enum `TipoAtividade`, sem tocar em nenhum dos módulos que a
concedem.

## 6. Comunicação entre módulos sem dependência circular

O `GardenService` precisa "saber" quando o usuário ganhou XP (para
creditar sementes), mas o `GamificationService` não deveria depender do
módulo `garden` diretamente — isso criaria uma dependência circular
(`garden` já depende de `gamification` para ler XP atual).

A solução usada é **evento de domínio via Spring**:

```java
// GamificationService publica, sem conhecer quem está ouvindo:
eventPublisher.publishEvent(new RecompensaConcedidaEvent(usuario.getId()));

// GardenService escuta, sem o Gamification saber que ele existe:
@EventListener
public void aoConcederRecompensa(RecompensaConcedidaEvent evento) {
    creditarSementesPorEstudo(evento.usuarioId());
}
```

Esse é o padrão a seguir para qualquer futura "reação a recompensa" que
precise ser adicionada sem acoplar módulos.

## 7. Camada de IA desacoplada

Requisito de arquitetura: deve ser possível trocar de provedor de IA
(Gemini, Groq, OpenRouter) ou usar um modo totalmente local (Mock) editando
apenas uma propriedade de configuração.

```
Controller → Service de domínio (QuizService/StudyPlanService)
           → Service de IA (AIQuizGeneratorService/AIStudyPlanGeneratorService)
           → interface AIProvider
           → implementação concreta escolhida em runtime
```

Cada implementação (`MockAIProvider`, `GeminiAIProvider`, `GroqAIProvider`,
`OpenRouterAIProvider`) é um `@Component` com um nome de bean qualificado
("MOCK", "GEMINI", "GROQ", "OPENROUTER"). O `AIProviderConfig` lê a
propriedade `memora.ia.provider` do `application.yml` e expõe, como
`@Primary`, o bean correspondente — com fallback automático para MOCK se o
valor configurado não for reconhecido. Nenhum outro ponto do sistema
conhece qual provedor está ativo.

## 8. Automação em background (`@Scheduled`)

5 jobs rodam periodicamente, cada um delegando a lógica real para o
Service do módulo correspondente (jobs nunca contêm regra de negócio,
mesma convenção dos Controllers):

| Job | Frequência | O que faz |
|---|---|---|
| `PetDecaySchedulerJob` | 6h | Decai humor da Leia por inatividade |
| `StreakSchedulerJob` | 00:05 diário | Quebra sequências de quem ficou um dia inteiro sem estudar |
| `CalendarAlertSchedulerJob` | 1h | Marca eventos próximos (48h) como notificados |
| `DailyMissionSchedulerJob` | 00:01 diário | Gera proativamente as missões do dia de cada usuário |
| `GardenSchedulerJob` | 3h | Recalcula o crescimento de todas as plantas |

A geração/recálculo "lazy" (no primeiro acesso à página/endpoint) continua
existindo em paralelo a esses jobs como rede de segurança — não foi
removida em nenhum caso.

## 9. Frontend: por que Thymeleaf + JS puro (e não SPA)

O requisito de stack exclui qualquer build step de Node.js. Isso descarta
frameworks como React/Vue/Angular no formato tradicional (que exigem
bundler). A escolha foi:

- **Thymeleaf** para renderizar a casca de cada página (layout, sidebar,
  drawer, bottom-nav) no servidor — primeira renderização rápida, SEO
  trivial (não que importe muito para um app autenticado, mas é grátis).
- **JavaScript puro** (sem framework) para buscar dados via `fetch` e
  popular o DOM dinamicamente — cada página tem seu próprio `<script>`
  inline que chama `Memora.chamarApi(...)` e renderiza HTML via template
  strings.
- **HTMX** disponível via CDN para casos onde swap parcial de HTML seria
  mais simples que manipulação manual do DOM (atualmente a maioria das
  páginas usa fetch direto + render manual, mas a biblioteca está
  carregada e pronta para uso incremental).
- **Chart.js** via CDN só na página de Estatísticas — não há necessidade
  de bibliotecas de gráfico em nenhum outro lugar do produto.

Esse modelo significa que **os Controllers MVC (`PageController`) nunca
passam dados via `Model`** — eles só resolvem qual template servir. Toda a
busca de dados acontece client-side, depois que a página já carregou. Essa
é uma decisão consistente em todas as 23 páginas do produto.

## 10. Sistema de design / CSS

Um único arquivo `static/css/memora.css` define todos os tokens (cores,
tipografia, espaçamento) e componentes reutilizáveis (`.card-memora`,
`.btn-memora`, `.campo-memora`, `.pill-memora`, `.item-card`,
`.grid-memora`, etc.) usados em todas as páginas. Bootstrap 5 é carregado
via CDN só para utilitários pontuais (grid em alguns lugares legados,
classes de espaçamento) — os componentes visuais principais são todos
`*-memora`, propositalmente, para manter uma identidade visual própria por
cima do Bootstrap em vez de usá-lo "cru".

`static/css/leia.css` é um arquivo dedicado só à Leia: todas as animações
(respirar, piscar, balançar o rabo, reações pontuais, confete) e as regras
de exibição condicional de boca/sobrancelha/coroa por humor e estágio.

## 11. Mobile-first: bottom-nav + drawer vs. sidebar

Por padrão (mobile, `<992px`), `.app-sidebar` tem `display:none` e a
navegação acontece por duas peças: `.bottom-nav` (5 destinos fixos,
sempre visível, com `padding-bottom: env(safe-area-inset-bottom)` para
respeitar a home indicator do iPhone) e `.app-drawer` (menu deslizante
completo, aberto pelo botão "Mais" da bottom-nav ou pelo ☰ da topbar). Em
desktop (`≥992px`), a sidebar tradicional assume e a bottom-nav/drawer são
escondidos via `display:none !important`.

Os três fragments (`sidebar`, `drawer`, `bottom-nav`) precisam ser mantidos
sincronizados manualmente sempre que um item de menu for adicionado ou
removido — não há uma fonte única de verdade para a lista de itens de
menu hoje (oportunidade de refatoração futura, não crítica).

## 12. Testes

A suíte atual é inteiramente de testes unitários (Mockito mockando
repositories e Services colaboradores), focada nas regras de negócio mais
sensíveis a erro: cálculo de nível (`CalculadoraNivelTest`), orquestração
de recompensa (`GamificationServiceTest`), máquina de estados de humor da
Leia (`PetServiceTest`), regras de equipagem por categoria
(`ShopServiceTest`), cálculo de crescimento combinado de plantas
(`GardenServiceTest`), conclusão de plano de estudos
(`StudyPlanServiceTest`), e fluxo de cadastro/login (`AuthServiceTest`).
Não há testes de Controller (`@WebMvcTest`) nem de integração completa
(`@SpringBootTest`) ainda — ver `PROJECT_STATUS.md` para o raciocínio.
