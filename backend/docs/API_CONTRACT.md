# StudyLeia — Contrato de API (Fase 1 da migração para React)

Este documento cataloga **todos os endpoints REST já existentes** no backend
Spring Boot. Ele é a fonte da verdade que o frontend React vai consumir — nada
aqui é especulativo, tudo foi extraído diretamente do código-fonte atual.

> Base URL local: `http://localhost:8080`
> Autenticação: JWT via header `Authorization: Bearer <token>` (exceto rotas
> marcadas como públicas)

---

## 0. Situação da separação front/back

**Boa notícia:** o backend já é, na prática, uma API REST completa. Todos os
70 endpoints abaixo vivem sob `/api/**` e retornam JSON puro — nenhum deles usa
`Model`/Thymeleaf.

A única peça "página" que existe é o `PageController`, que **apenas devolve
o nome de um template HTML vazio** (sem dados) para cada rota de página
(`/dashboard`, `/leia`, `/quizzes`, etc.) — o JS antigo é quem chama os
endpoints de `/api/**` depois que a página carrega.

**Estratégia adotada nesta fase:**
- `PageController` e os templates Thymeleaf continuam existindo e funcionando
  normalmente — ninguém depende deles sendo removidos agora.
- O app React vai rodar em paralelo (Vite dev server, porta `5173`) e consumir
  exatamente estes mesmos endpoints.
- Cada template Thymeleaf só será removido quando a página React equivalente
  entrar no ar (fases 5, 6 e 7 do plano), rota por rota.
- CORS: já está liberado em `SecurityConfig` (`allowedOriginPatterns: *` +
  `allowCredentials: true`), então o Vite já consegue chamar a API sem
  configuração adicional. **Recomendação para produção:** trocar o `*` pela
  origem real do domínio do frontend antes de publicar (hoje está aberto para
  qualquer origem, o que é aceitável em dev mas não em produção).

---

## 1. Autenticação — `/api/auth` (público, exceto `/perfil`)

| Método | Rota | Request | Response |
|---|---|---|---|
| POST | `/api/auth/registro` | `RegistroRequest{nome, email, senha}` | `AuthResponse` |
| POST | `/api/auth/login` | `LoginRequest{email, senha}` | `AuthResponse{token, usuarioId, nome, email}` |
| POST | `/api/auth/logout` | — | 200 OK |
| POST | `/api/auth/esqueci-senha` | `EsqueciSenhaRequest{email}` | 200 OK |
| POST | `/api/auth/redefinir-senha` | `RedefinirSenhaRequest{token, novaSenha}` | 200 OK |
| GET | `/api/auth/perfil` 🔒 | — | `PerfilResponse{id, nome, email, nomeDaPet}` |
| PUT | `/api/auth/perfil` 🔒 | `AtualizarPerfilRequest{nome, nomeDaPet}` | `PerfilResponse` |

## 2. Dashboard — `/api/dashboard` 🔒

| Método | Rota | Response |
|---|---|---|
| GET | `/api/dashboard` | `DashboardResponse{saudacao, nomeUsuario, pet: PetStatusResponse, progresso: ProgressoResponse, proximosEventos: EventResponse[]}` |

## 3. Pet (Leia) — `/api/pet` 🔒

| Método | Rota | Request | Response |
|---|---|---|---|
| GET | `/api/pet/status` | — | `PetStatusResponse{nomePet, humor, estagioEvolucao}` |
| POST | `/api/pet/carinho` | — | `PetStatusResponse` |

Enums relevantes:
- `HumorPet`: `TRISTE, ENTEDIADA, NEUTRA, FELIZ` (+ possivelmente mais — conferir)
- `EstagioEvolucao`: `FILHOTE (níveis 1-4), JOVEM (5-9), ADULTA (10-19), SABIA (20-29)` (+ estágios acima)

## 4. Gamificação — `/api/gamification` 🔒

| Método | Rota | Response |
|---|---|---|
| GET | `/api/gamification/progresso` | `ProgressoResponse{xpTotal, nivelAtual, xpFaltanteProximoNivel, progressoPercentual, moedas, sequenciaAtual, maiorSequencia}` |
| GET | `/api/gamification/achievements` | `AchievementResponse[]{tipo, titulo, descricao, ...}` (conquistas desbloqueadas) |
| GET | `/api/gamification/achievements/catalogo` | `AchievementResponse[]` (catálogo completo, incluindo bloqueadas) |

`TipoConquista`: `PRIMEIRA_PROVA, CEM_QUESTOES_RESPONDIDAS, MIL_XP, CINCO_MIL_XP, PRIMEIRA_ANOTACAO, PRIMEIRO_PLANO_CONCLUIDO, DEZ_QUIZZES_CRIADOS, ...`

`TipoAtividade` (regra de XP/moedas por ação — fonte única de verdade):
| Atividade | XP | Moedas |
|---|---|---|
| Resposta correta de quiz | 10 | 2 |
| Resposta errada de quiz | 2 | 0 |
| Quiz completo | 15 | 5 |
| Anotação criada | 5 | 1 |
| Plano de estudos concluído | 20 | 8 |
| Sessão de foco concluída | 12 | 3 |
| Missão diária concluída | 8 | 4 |
| Evento de calendário criado | 3 | 1 |

## 5. Quizzes — `/api/quizzes` 🔒

| Método | Rota | Request | Response |
|---|---|---|---|
| GET | `/api/quizzes` | — | `QuizResumoResponse[]{id, titulo, tema, dificuldade, origem, totalQuestoes}` |
| GET | `/api/quizzes/{id}` | — | `QuizResponse{id, titulo, tema, dificuldade, origem, totalQuestoes, questoes: QuestaoResponse[]}` |
| POST | `/api/quizzes` | `QuizCriarRequest{titulo, tema, dificuldade, questoes[]}` | `QuizResponse` |
| POST | `/api/quizzes/gerar-com-ia` | `GerarQuizIARequest{tema, quantidade (1-30), dificuldade}` | `QuizResponse` |
| POST | `/api/quizzes/{quizId}/questoes/{questaoId}/responder` | `ResponderQuestaoRequest{alternativaId}` | `RespostaQuestaoResultado{correta, alternativaCorretaId, mensagemIncentivo, ...}` |
| POST | `/api/quizzes/{quizId}/concluir` | — | `RecompensaResponse{xpGanho, moedasGanhas, xpTotal, nivelAnterior, nivelAtual, subiuDeNivel, leiaEvoluiu}` |
| DELETE | `/api/quizzes/{id}` | — | 204 |

`Dificuldade`: `FACIL, MEDIA, DIFICIL` · `OrigemQuiz`: `MANUAL, IA`

## 6. Plano de Estudos — `/api/study-plans` 🔒

| Método | Rota | Request | Response |
|---|---|---|---|
| GET | `/api/study-plans` | — | `StudyPlanResumoResponse[]{id, materia, dataProva, concluido, percentualConcluido}` |
| GET | `/api/study-plans/{id}` | — | `StudyPlanResponse{..., itens: ItemResponse[]}` |
| POST | `/api/study-plans/gerar-com-ia` | `GerarPlanoEstudosRequest{materia, dataProva (futuro), horasDisponiveisPorDia (≥0.5)}` | `StudyPlanResponse` |
| PATCH | `/api/study-plans/{planId}/itens/{itemId}/concluir` | — | `StudyPlanResponse` |
| DELETE | `/api/study-plans/{id}` | — | 204 |

`TipoItemCronograma`: `ESTUDO, REVISAO, SIMULADO` (a IA gera os 3 tipos misturados no cronograma)

## 7. Anotações — `/api/notes` 🔒

| Método | Rota | Request | Response |
|---|---|---|---|
| GET | `/api/notes` | — | `NoteResponse[]{id, titulo, conteudo, categoria, tags[], criadoEm}` |
| GET | `/api/notes/{id}` | — | `NoteResponse` |
| POST | `/api/notes` | `NoteRequest{titulo, conteudo, categoria, tags[]}` | `NoteResponse` |
| PUT | `/api/notes/{id}` | `NoteRequest` | `NoteResponse` |
| DELETE | `/api/notes/{id}` | — | 204 |

## 8. Calendário — `/api/calendar` 🔒

| Método | Rota | Request | Response |
|---|---|---|---|
| GET | `/api/calendar/events` | — | `EventResponse[]{id, titulo, tipo, dataHora, descricao}` |
| GET | `/api/calendar/alertas` | — | `EventResponse[]` (eventos próximos) |
| POST | `/api/calendar/events` | `EventRequest{titulo, tipo, dataHora, descricao}` | `EventResponse` |
| PUT | `/api/calendar/events/{id}` | `EventRequest` | `EventResponse` |
| DELETE | `/api/calendar/events/{id}` | — | 204 |

`TipoEvento`: `PROVA, TRABALHO, APRESENTACAO, ...`

## 9. Modo Foco — `/api/focus` 🔒

| Método | Rota | Request | Response |
|---|---|---|---|
| POST | `/api/focus/concluir` | `ConcluirSessaoFocoRequest{tipo}` | `SessaoFocoResultado{concedeuXp, totalMinutosFocoHoje}` |
| GET | `/api/focus/minutos-hoje` | — | número de minutos |

`TipoSessaoFoco`: `FOCO, ...` (Pomodoro: foco/pausa)

## 10. Missões Diárias — `/api/missions` 🔒

| Método | Rota | Response |
|---|---|---|
| GET | `/api/missions/hoje` | `DailyMissionResponse[]{id, tipo, titulo, progresso, meta}` |

## 11. Jardim — `/api/garden` 🔒

| Método | Rota | Request | Response |
|---|---|---|---|
| GET | `/api/garden` | — | `GardenResponse{sementes, totalFloresColhidas, plantas: PlantaResponse[]}` |
| POST | `/api/garden/plantar` | `PlantarRequest{tipo}` | `GardenResponse` |
| POST | `/api/garden/{plantaId}/colher` | — | `GardenResponse` |

`TipoPlanta` (nome, custo em sementes, tempo p/ crescer): `FLOR_AZUL(5,3), GIRASSOL(8,5), ROSA(10,4), LAVANDA(12,6)`
`EstagioCrescimento`: `SEMENTE, BROTO, CRESCENDO, ...`

## 12. Loja — `/api/shop` 🔒

| Método | Rota | Request | Response |
|---|---|---|---|
| GET | `/api/shop/catalogo` | — | `ItemLojaResponse[]{id, tipoItem, nome, descricao, categoria, raridade, preco, icone, gradiente, codigoCena, possuido}` |
| GET | `/api/shop/inventory` | — | `InventoryItemResponse[]` |
| GET | `/api/shop/history` | — | `PurchaseHistoryResponse[]{tipoItem, nomeItem, precoPago}` |
| POST | `/api/shop/comprar` | `ComprarItemRequest{tipoItem, itemId}` | `CompraResultado{sucesso, nomeItem, precoPago}` |
| POST | `/api/shop/equipar` | `{itemId}` | 200 |
| POST | `/api/shop/desequipar` | `{itemId}` | 200 |

`Raridade`: `COMUM, RARA, EPICA, ...` · `TipoItemLoja`: `COSMETICO, ...`

## 13. Estatísticas — `/api/statistics` 🔒

| Método | Rota | Response |
|---|---|---|
| GET | `/api/statistics` | `StatisticsResponse{totalHorasEstudadas, xpAcumulado, totalQuestoesRespondidas, totalQuestoesCorretas, taxaAcertoGeral, sequenciaAtual, maiorSequencia, diasAtivos, xpPorSemana[], xpPorMes[], atividadeSemanal[], atividadeMensal[], acertosPorMateria[], materiasMaisEstudadas[]}` |

---

## Resumo por área (para o planejamento das próximas fases)

| Área | Endpoints | Complexidade p/ migrar |
|---|---|---|
| Auth | 7 | Baixa — fluxo padrão de formulários |
| Dashboard | 1 (mas agrega várias entidades) | Média — primeira tela "de verdade" |
| Pet/Leia | 2 | Alta na parte visual (animação), baixa na API |
| Gamificação | 3 | Baixa — leitura, sem forms |
| Quizzes | 7 | Alta — fluxo de jogo com feedback visual |
| Study Plans | 5 | Média — geração por IA + checklist |
| Notes | 5 | Baixa — CRUD simples |
| Calendar | 5 | Média — precisa de componente de calendário |
| Focus | 2 | Média — timer + estado da Leia durante o foco |
| Missions | 1 | Baixa |
| Garden | 3 | Média — grid de vasos + estados de crescimento |
| Shop | 6 | Média — catálogo + inventário + equipar |
| Statistics | 1 | Média — vários gráficos |

Isso confirma a ordem de fases que propus: **Auth → Dashboard/Leia → Quiz/Plano/Calendário → Garden/Shop/Foco/Missões/Conquistas/Estatísticas**, do mais simples/fundamental para o mais específico.
