# DATABASE — Memora — Leia Edition

Banco MySQL 8, schema gerenciado 100% por migrations Flyway (Hibernate
configurado com `ddl-auto: validate` — nunca cria ou altera tabelas, só
confere se as entidades batem com o schema existente). Todas as tabelas
usam `utf8mb4_unicode_ci` / `InnoDB`.

22 tabelas, distribuídas em 11 migrations (V1 a V11).

## Convenções gerais

- Toda PK é `CHAR(36)` (UUID gerado pela aplicação, nunca pelo banco).
- Toda FK para `usuarios` tem `ON DELETE CASCADE` — excluir um usuário
  remove em cascata todo o seu histórico (gamificação, notas, quizzes,
  inventário, jardim, etc.).
- Entidades que estendem `BaseEntity` no código Java têm sempre
  `criado_em DATETIME NOT NULL` e `atualizado_em DATETIME NOT NULL`
  (preenchidos automaticamente via `@CreatedDate`/`@LastModifiedDate`).
  Entidades "de evento/registro imutável" (ver lista na seção de exceções
  abaixo) têm só um timestamp único.
- Índices em toda FK e em campos de busca frequente (data, status,
  categoria).

## V1 — `usuarios`

Tabela raiz de autenticação e perfil.

| Campo | Tipo | Observação |
|---|---|---|
| id | CHAR(36) PK | |
| email | VARCHAR(150) UNIQUE | |
| nome | VARCHAR(100) | |
| nome_da_pet | VARCHAR(60) | padrão "Leia" |
| senha_hash | VARCHAR(255) | BCrypt, nunca texto puro |
| cor_tema | VARCHAR(20) | padrão "azul" |
| ativo | BOOLEAN | usado por `UserDetails.isEnabled()` |
| token_recuperacao | VARCHAR(255) | nulo na maior parte do tempo |
| token_recuperacao_expira_em | DATETIME | expiração de 1h |

## V2 — gamificação: `user_progress`, `streaks`, `achievements`

**`user_progress`** (1:1 com usuário) — o "placar" central: `xp_total`,
`nivel_atual`, `moedas`, mais contadores específicos
(`total_quizzes_respondidos`, `total_questoes_corretas`,
`total_anotacoes_criadas`, `total_planos_concluidos`,
`total_minutos_foco`) usados por conquistas e pelo Jardim.

**`streaks`** (1:1 com usuário) — `sequencia_atual`, `maior_sequencia`,
`ultimo_dia_estudado` (DATE).

**`achievements`** — registro de badges desbloqueados. Constraint única
`(usuario_id, tipo)` garante que a mesma conquista nunca seja duplicada.

## V3 — `pet_status`

1:1 com usuário. Estado da Leia: `nome_pet`, `humor` (enum
`HumorPet`: TRISTE/ENTEDIADA/NEUTRA/FELIZ/SUPER_FELIZ), `estagio_evolucao`
(enum `EstagioEvolucao`: FILHOTE/JOVEM/ADULTA/SABIA/RAINHA_LEIA),
`ultima_interacao_em`, `total_carinhos`.

## V4 — `notes`

Anotações de estudo. `tags` é armazenado como string CSV simples (não há
tabela de relacionamento dedicada — decisão de simplicidade, convertida
para `List<String>` no `NoteMapper`).

## V5 — quiz: `quizzes`, `quiz_questions`, `quiz_answers`, `quiz_attempts`

Hierarquia: um `Quiz` tem N `QuizQuestion`, cada questão tem N
`QuizAnswer` (alternativas, com `correta BOOLEAN`). `QuizAttempt` registra
cada resposta dada pela usuária (usuário + questão + alternativa
escolhida + se acertou) — usado para idempotência básica e para as
estatísticas de "acertos por matéria" (join até `quizzes.tema`).

## V6 — study plan: `study_plans`, `study_plan_items`

Um `StudyPlan` (matéria, data da prova, horas/dia, resumo gerado por IA,
flag `concluido`) tem N `StudyPlanItem` (data, assunto, tipo —
ESTUDO/REVISAO/SIMULADO —, descrição, flag `concluido` individual). O
plano só fica `concluido=true` quando todos os itens estiverem concluídos.

## V7 — `events`

Calendário: `tipo` (PROVA/TRABALHO/APRESENTACAO/LEMBRETE), `data_hora`,
`descricao`, `alerta_enviado` (usado pelo `CalendarAlertSchedulerJob` para
não reprocessar o mesmo evento).

## V8 — `focus_sessions`

Registro de cada sessão de Pomodoro concluída (`tipo` FOCO/PAUSA,
`duracao_minutos`, `concluida_em`). O timer em si é 100% frontend; esta
tabela só guarda o resultado final de cada ciclo.

## V9 — `daily_missions`

Missões diárias geradas por usuário/dia. Constraint única
`(usuario_id, data, tipo)` — uma usuária nunca tem duas missões do mesmo
tipo no mesmo dia.

## V10 — loja: `cosmetic_items`, `background_themes`, `user_inventory`, `purchase_history`

**`cosmetic_items`** e **`background_themes`** são **catálogos estáticos**
(não pertencem a nenhum usuário) — populados via `INSERT` direto na própria
migration (seed inicial: 10 cosméticos, 6 cenários). `cosmetic_items` tem
`categoria` (LACO/OCULOS/CHAPEU/GRAVATA/ACESSORIO_ESPECIAL) e
`posicao_overlay` (string livre usada pelo frontend para posicionar o
emoji sobre o SVG da Leia). `background_themes` tem `gradiente` (string CSS
`linear-gradient(...)` aplicada direto como background).

**`user_inventory`** — o que cada usuária *possui*. `tipo_item`
(COSMETICO/CENARIO) + `item_ref_id` apontam para o catálogo correspondente
(sem FK de banco entre as tabelas, porque `item_ref_id` pode apontar para
duas tabelas diferentes dependendo de `tipo_item` — validado na camada de
aplicação). Constraint única `(usuario_id, tipo_item, item_ref_id)` — não
é possível comprar o mesmo item duas vezes.

**`purchase_history`** — registro **imutável** de cada compra, com nome e
preço "congelados" no momento da compra (mesmo que o catálogo mude depois,
o histórico permanece correto).

## V11 — jardim: `gardens`, `user_plants`

**`gardens`** (1:1 com usuário) — saldo de `sementes` (10 iniciais no
cadastro) e `total_flores_colhidas`.

**`user_plants`** — cada planta individual num vaso (`posicao_vaso`,
0-11). Guarda um *snapshot* de `xp_no_plantio` e
`metas_concluidas_no_plantio` tirado no momento do plantio, usado para
calcular quanto XP/quantas metas foram ganhas *durante* o crescimento
daquela planta específica, sem precisar de uma tabela de eventos própria.

> **Decisão deliberada sobre integridade**: não existe uma constraint
> única em `(garden_id, posicao_vaso)`. Isso é intencional — depois que
> uma planta é colhida (`colhida=true`), ela permanece na tabela como
> histórico, e uma nova planta pode ocupar o mesmo vaso. Uma constraint
> única simples bloquearia esse reaproveitamento. A regra "só uma planta
> *ativa* por vaso" é garantida em `GardenService.plantar()`, na camada
> de aplicação.

## Entidades que NÃO estendem `BaseEntity`

Por serem registros de evento/imutáveis, estas têm apenas um timestamp
único (via `@PrePersist`), não o par `criado_em`/`atualizado_em`:
`Achievement` (`desbloqueada_em`), `PurchaseHistory` (`comprado_em`),
`UserInventory` (`adquirido_em`), `UserPlant` (`plantada_em`),
`QuizAttempt` (`respondida_em`), `FocusSession` (`concluida_em`).

## Diagrama de relacionamento simplificado

```
usuarios (1) ──┬── (1) user_progress
               ├── (1) streaks
               ├── (1) pet_status
               ├── (1) gardens ── (N) user_plants
               ├── (N) achievements
               ├── (N) notes
               ├── (N) quizzes ── (N) quiz_questions ── (N) quiz_answers
               │                                              ↑
               ├── (N) quiz_attempts ─────────────────────────┘
               ├── (N) study_plans ── (N) study_plan_items
               ├── (N) events
               ├── (N) focus_sessions
               ├── (N) daily_missions
               ├── (N) user_inventory ──┐
               └── (N) purchase_history │
                                        ├──→ cosmetic_items (catálogo estático)
                                        └──→ background_themes (catálogo estático)
```

## Rodando localmente

Via XAMPP: inicie o MySQL, e deixe o Flyway criar o banco automaticamente
(`createDatabaseIfNotExist=true` na URL do datasource em
`application.yml`) — não é necessário criar `memora_db` manualmente no
phpMyAdmin antes de rodar a aplicação.

Via Docker: o serviço `mysql` do `docker-compose.yml` já nasce com o banco
`memora_db` criado (variável `MYSQL_DATABASE`) e as migrations rodam
automaticamente na inicialização da aplicação.
