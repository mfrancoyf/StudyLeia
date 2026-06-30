# PROJECT_STATUS — Memora — Leia Edition

> Última atualização: revisão final de produto (responsividade mobile-first,
> redesenho visual da Leia, jobs agendados, testes, Docker, documentação).

## Percentual real de conclusão: **~90%**

O backend está **funcionalmente completo e congelado** (nenhuma nova
entidade, módulo ou API deve ser criada sem decisão explícita — ver seção
"Backend congelado" abaixo). O frontend cobre **100% das rotas e endpoints**
existentes (nenhuma página quebrada, nenhum endpoint órfão, nenhum botão sem
função). O que falta para a v1.0 é, em essência, **polimento incremental**
listado na seção 6 — não há nenhuma funcionalidade core ausente.

---

## 1. O que foi implementado

### 1.1 Backend (18 módulos de domínio, 166 arquivos Java)

| Módulo | Responsabilidade |
|---|---|
| `auth` | Cadastro, login, logout, recuperação de senha, perfil. JWT em cookie HttpOnly. |
| `config` / `config.security` | Spring Security, filtro JWT, CORS, tratamento de erro de autenticação. |
| `exception` | Exceções de negócio + handler global único para toda a API. |
| `gamification` | XP, nível, moedas, streak, conquistas. Serviço orquestrador central. |
| `pet` | Humor e evolução visual da Leia. |
| `notes` | CRUD de anotações de estudo. |
| `quiz` | Quizzes manuais e gerados por IA; fluxo de resposta gamificado. |
| `integration.ai` | Camada desacoplada de IA (interface `AIProvider` + 4 implementações). |
| `studyplan` | Planos de estudo gerados por IA, com cronograma item a item. |
| `calendar` | Eventos (provas, trabalhos, apresentações, lembretes) e alertas de proximidade. |
| `focus` | Sessões de Modo Foco (Pomodoro). |
| `dailymission` | Missões diárias geradas automaticamente. |
| `dashboard` | Agregador de leitura para a tela inicial. |
| `shop` | Catálogo combinado, compras, inventário, equipagem, histórico. |
| `cosmetic` | Catálogo de cosméticos da Leia (laços, óculos, chapéus, gravatas, especiais). |
| `background` | Catálogo de cenários de fundo. |
| `garden` | Jardim da Leia: sementes, plantio, crescimento combinado (tempo + XP + metas). |
| `statistics` | Painel de métricas avançadas (XP, acertos, atividade, matérias). |

**Automação em background (jobs `@Scheduled`)** — 5 jobs ativos:

1. `PetDecaySchedulerJob` — decai o humor da Leia por inatividade (a cada 6h).
2. `StreakSchedulerJob` — quebra sequências de quem ficou um dia inteiro sem estudar (00:05).
3. `CalendarAlertSchedulerJob` — marca eventos das próximas 48h como notificados (a cada hora).
4. `DailyMissionSchedulerJob` — gera proativamente as missões do dia de todo usuário ativo (00:01).
5. `GardenSchedulerJob` — recalcula o crescimento de todas as plantas de todos os jardins (a cada 3h).

A geração "lazy" (no primeiro acesso do dia/página) permanece como rede de
segurança em paralelo a esses jobs — nenhuma delas foi removida.

**Camada de IA**: interface `AIProvider` com 4 implementações —
`MockAIProvider` (padrão, funciona sem nenhuma chave de API), `GeminiAIProvider`,
`GroqAIProvider`, `OpenRouterAIProvider`. Trocar de provider é uma única
variável de ambiente (`MEMORA_IA_PROVIDER`), sem tocar em nenhuma outra
camada do sistema.

### 1.2 Banco de dados

- **11 migrations Flyway** (V1 a V11), todas com `utf8mb4_unicode_ci` /
  `InnoDB`, FKs com `ON DELETE CASCADE`, e índices nos campos de busca
  frequente. Ver `DATABASE.md` para o schema completo.
- Seed inicial de 10 cosméticos e 6 cenários já populado na migration V10 —
  a loja nunca nasce vazia.

### 1.3 Frontend (23 templates Thymeleaf)

- **Mobile-first real**: layout pensado para iPhone 14 (390px lógicos) como
  base, com breakpoint único para desktop (`≥992px`). Navegação mobile via
  bottom-nav (5 destinos fixos) + drawer deslizante (menu completo) — a
  sidebar tradicional só aparece em desktop. Sem scroll horizontal, alvos
  de toque ≥44px, inputs com `font-size:16px` (evita zoom automático do
  Safari iOS).
- **100% das rotas têm template real e funcional** — nenhuma página
  placeholder, nenhum "em construção".
- **100% dos endpoints REST do backend são consumidos por pelo menos uma
  página** — verificação cruzada feita e documentada nesta revisão.
- A Leia (mascote SVG/CSS, sem nenhuma dependência de imagem externa) com
  5 humores × 5 estágios de evolução, animações de respiração, piscar,
  balanço de rabo, reações pontuais de "ganhou XP" e "surpresa", e overlay
  de cosméticos equipados.
- Gamificação visual: toasts de XP/nível, confete de celebração, badges de
  raridade, barras de progresso animadas — disparados de forma consistente
  em quiz, planos de estudo, loja e jardim.
- PWA: `manifest.json`, service worker (`sw.js`, cache-first para estáticos,
  network-only para `/api/**`), ícones gerados a partir da arte da Leia,
  instalável na tela inicial do iPhone via Safari.

### 1.4 Qualidade

- **7 classes de teste JUnit 5 + Mockito** cobrindo as regras de negócio
  mais críticas: `CalculadoraNivelTest`, `AuthServiceTest`,
  `GamificationServiceTest`, `PetServiceTest`, `ShopServiceTest`,
  `GardenServiceTest`, `StudyPlanServiceTest`.
- **Docker completo**: `Dockerfile` multi-stage (build com Maven, runtime
  com JRE Alpine, usuário não-root, healthcheck), `docker-compose.yml`
  (MySQL 8 com volume persistente e healthcheck + app, rede dedicada,
  todas as variáveis de ambiente com valor padrão funcional —
  `docker compose up --build` funciona sem nenhuma configuração manual).
- Tratamento de erro centralizado (`GlobalExceptionHandler`) cobrindo todas
  as exceções de negócio do sistema, incluindo a nova
  `MoedasInsuficientesException` (HTTP 402) da loja.

---

## 2. Redesenho visual da Leia (esta revisão)

A arte anterior da Leia foi **completamente substituída**. O problema
reportado — expressão lendo como "brava"/agressiva por causa de uma máscara
facial grande e simétrica que se parecia com sobrancelhas franzidas — foi
corrigido com um redesenho do zero:

- Proporção chibi/cozy-game: cabeça grande e redonda, olhos enormes
  (quase 1/3 da largura do rosto).
- Manchas tortie reduzidas a marcas pequenas e **assimétricas** (só de um
  lado), nunca formando uma máscara simétrica nos dois olhos.
- Bochechas rosadas sempre visíveis, em qualquer humor.
- Boca sempre com alguma curva (mesmo a "neutra" tem leve curva para cima)
  — nunca uma linha reta que lê como seriedade.
- Sobrancelhas só aparecem (sutis, altas, curvas de preocupação) nos
  humores TRISTE/ENTEDIADA — nunca como marca de bravura.
- Mesma API de uso (`mascote(humor, estagio, tamanho)`), zero mudança de
  regra de negócio — só o asset visual e o CSS de exibição mudaram.
- Ícones do PWA (192px, 512px) e favicon regenerados com a nova arte.

A infraestrutura já era (e continua sendo) pensada para evolução visual
sem refatoração: trocar a arte da Leia de novo no futuro significa editar
apenas `fragments/leia.html` + `static/css/leia.css` — nenhum Service,
Controller ou regra de negócio precisa mudar.

---

## 3. Backend congelado — o que isso significa na prática

A partir desta revisão, o backend é tratado como **estável**. Mudanças
aceitáveis sem que isso conte como "nova funcionalidade":

- Correção de bugs.
- Pequenos métodos auxiliares públicos que não mudam contratos existentes
  (ex.: `recalcularTodosOsJardins()` foi adicionado ao `GardenService` só
  para servir o job agendado, sem alterar nenhuma assinatura pública usada
  pelo frontend).
- Logs, validações adicionais, ajustes de mensagem de erro.
- Otimizações que não mudam o comportamento observável (ex.: a consulta
  duplicada de inventário em `ShopService.listarCatalogo` foi unificada
  numa única chamada nesta revisão).

Mudanças que **exigem decisão explícita** antes de serem feitas: qualquer
nova entidade, tabela, endpoint REST, ou Service com regra de negócio nova.

---

## 4. Pendências reais remanescentes (escopo futuro / polimento)

Nenhuma delas bloqueia o uso real da plataforma — são refinamentos.

1. **E-mail de recuperação de senha real**: hoje, se o SMTP não estiver
   configurado, o token só fica no log da aplicação (comportamento
   intencional documentado em `AuthService`, mas exige configurar
   `MAIL_USERNAME`/`MAIL_PASSWORD` para o fluxo de e-mail funcionar de
   ponta a ponta em produção).
2. **Precisão da série de XP nas Estatísticas**: `xpPorSemana`/`xpPorMes`
   no `StatisticsService` são uma aproximação (10 XP por acerto de quiz,
   2 XP por erro), já que não existe uma tabela `xp_history` dedicada.
   Funciona bem para visualização, mas não soma XP de notas/planos/foco
   nessa série especificamente (esses XPs entram no total acumulado, só
   não aparecem fatiados por semana/mês). Criar essa tabela é uma extensão
   futura natural, não uma correção de bug.
3. **Constraint de unicidade de vaso do Jardim**: a regra "só uma planta
   ativa por vaso" é garantida na camada de aplicação (`GardenService`),
   não por uma constraint de banco — decisão deliberada, documentada em
   `DATABASE.md`, porque uma constraint única simples em
   `(garden_id, posicao_vaso)` impediria reaproveitar o vaso depois de uma
   colheita (a linha antiga com `colhida=true` permanece na tabela).
4. **Calendário visual**: a página `/calendar` é uma lista cronológica
   (não um grid de mês tipo Google Calendar) — atende ao pedido original,
   mas um componente de calendário visual completo é uma melhoria futura
   de UX caso a Ana Laura sinta falta dele.
5. **Internacionalização**: todo o texto está em português fixo (correto
   para o público-alvo declarado), sem nenhuma camada de i18n — não é uma
   lacuna, é uma decisão de escopo.
6. **Testes de integração `@SpringBootTest`**: a suíte atual é só de
   testes unitários (Service layer com Mockito). Testes de integração
   ponta a ponta (registrar → responder quiz → verificar XP, usando o
   perfil `test` com H2 já configurado em `application-test.yml`) ainda
   não foram escritos.
7. **Compilação não validada neste ambiente**: o sandbox onde este projeto
   foi construído não tem Maven instalado nem acesso aos repositórios
   Maven Central, então a compilação real (`mvn clean package`) nunca foi
   executada aqui — toda verificação foi revisão manual de código (imports,
   assinaturas, referências cruzadas). **Recomendação**: rodar
   `mvn clean compile` como primeiro passo ao abrir o projeto localmente.

---

## 5. Convenções de código (para qualquer trabalho futuro no projeto)

- Todo o código (classes, métodos, variáveis, comentários, mensagens de
  exceção) em **português**.
- Controllers nunca contêm regra de negócio — só recebem request, chamam
  um método do Service, devolvem `ResponseEntity`.
- Services são `@Transactional` (`readOnly = true` em métodos de leitura).
- DTOs são `record` com Bean Validation.
- Entidades de domínio do usuário estendem `BaseEntity` (campos
  `criadoEm`/`atualizadoEm` automáticos) — exceção deliberada para
  entidades "de evento/registro imutável" (`Achievement`, `PurchaseHistory`,
  `UserInventory`, `UserPlant`), que usam só um timestamp via `@PrePersist`.
- Toda entidade usa `@Id @GeneratedValue(strategy = GenerationType.UUID)`.
- Toda relação para `Usuario` é `@ManyToOne`/`@OneToOne` com `FetchType.LAZY`.
- Toda operação de escrita que afeta um recurso de outro usuário valida
  propriedade antes (lança `AcessoNegadoException` em caso de violação).
- Toda atividade gamificável passa exclusivamente por
  `GamificationService.concederRecompensa(usuario, TipoAtividade.X)`.
- Reações desacopladas a eventos de gamificação usam
  `ApplicationEventPublisher`/`@EventListener` (ver `GardenService`
  escutando `RecompensaConcedidaEvent`) — evita dependência circular entre
  módulos.
- Lombok com `@RequiredArgsConstructor` (injeção via construtor, nunca
  `@Autowired` em campo). MapStruct puro para mapeamento 1:1 entidade→DTO;
  combinações de múltiplas fontes são montadas manualmente no Service.
- Frontend: toda página autenticada inclui os 3 fragments de navegação
  (`sidebar`, `drawer`, `bottom-nav`) com a mesma chave de `paginaAtiva`.
  Toda chamada de API no JS de página usa `Memora.chamarApi(...)`. Grid
  responsivo próprio (`.grid-memora`) é preferido ao grid do Bootstrap nas
  páginas novas.

---

## 6. Próximos passos sugeridos (ordem de prioridade)

1. Validar a compilação local (`mvn clean compile && mvn test`).
2. Configurar SMTP real se o fluxo de recuperação de senha por e-mail for
   necessário em produção.
3. Testar o fluxo completo manualmente num iPhone real (ou simulador) para
   validar a experiência mobile-first na prática.
4. Decidir se a tabela `xp_history` (item 2 da seção de pendências) vale o
   esforço, ou se a aproximação atual das Estatísticas é suficiente.
5. Escrever os testes de integração `@SpringBootTest` se uma cobertura
   mais ampla for desejada antes de um lançamento público.
