# MEMORA — LEIA EDITION — DOCUMENTO DE CONTINUAÇÃO (uso interno da IA)

> Este arquivo é diferente do PROJECT_STATUS.md — aquele é para humanos
> entenderem o projeto; este é para uma instância futura do Claude retomar
> o trabalho exatamente de onde parou, sem precisar re-explorar tudo.

## Estado no fim desta sessão de revisão final

Backend **congelado** (sem novas entidades/módulos/APIs sem decisão
explícita do usuário). 166 arquivos Java, 7 classes de teste, 11
migrations, 23 templates, 5 jobs `@Scheduled`, Docker completo, 4
documentos de produto (`README.md`, `PROJECT_STATUS.md`,
`ARCHITECTURE.md`, `DATABASE.md`) já escritos na raiz do projeto.

## O que foi feito nesta sessão (revisão final pós-checkpoint 3)

1. **Validação do workspace a pedido do usuário** — usuário relatou ter
   recebido um zip incompleto (só pom.xml + application.yml) localmente;
   `find` confirmou que o workspace real estava intacto (165+ arquivos);
   gerado e entregue um zip de validação antes de qualquer nova mudança,
   conforme pedido explícito do usuário ("não implemente nada, só valide").
2. **Redesenho completo da Leia** (prioridade máxima do usuário): o SVG
   antigo tinha uma "máscara" facial grande e simétrica que lia como
   sobrancelhas franzidas/expressão brava. Redesenhado do zero em
   `templates/fragments/leia.html` com proporção chibi/cozy (cabeça
   grande, olhos enormes ~1/3 do rosto), manchas tortie pequenas e
   assimétricas (só de um lado), bochechas rosadas sempre visíveis, boca
   sempre com curva (nunca reta). Mesma API (`mascote(humor, estagio,
   tamanho)`), zero mudança de regra de negócio. Ícones PWA e favicon
   regenerados com a nova arte via cairosvg.
3. **Animações/reações novas em `leia.css`**: `.leia--surpresa` (olhos
   arregalam + pulo, usado em level-up/evolução/conquista/item raro) e
   `.leia--ganhou-xp` (aceno sutil, usado em qualquer ganho de XP pontual).
   Expostas via `Memora.reagirLeia(nome)` em `memora.js`, chamadas
   automaticamente dentro de `Memora.processarRecompensa(...)` e também
   manualmente em loja/jardim/plano-de-estudos.
4. **Auditoria sistemática de endpoints órfãos**: rodado script
   comparando os 39 endpoints REST do backend contra o uso real em
   templates+JS. Encontrados e corrigidos: `/api/pet/status` (agora usado
   no Modo Foco para refletir o estágio real da Leia, e o retorno de
   `/api/pet/carinho` agora atualiza o humor em tempo real via novo
   helper `Memora.aplicarHumorNoWidget`), `/api/calendar/alertas` (agora
   um banner na página de calendário), `/api/missions/hoje` (agora uma
   seção na página de Modo Foco), `PUT /api/calendar/events/{id}` (agora
   a página de calendário tem edição completa, não só criação/exclusão),
   `DELETE /api/study-plans/{id}` (agora a lista de planos tem botão de
   excluir). Resultado final: **100% dos endpoints têm uso real**.
5. **Auditoria de rotas vs templates**: confirmado 1:1 exato entre as 20
   views do `PageController` e os 20 arquivos `.html` correspondentes
   (fora fragments). Nenhuma órfã.
6. **Busca por placeholders/TODOs/texto de exemplo**: nenhum encontrado
   (os 2 falsos positivos do grep — "em breve" e o nome do arquivo
   esqueci-senha — foram inspecionados e são uso legítimo de português).
7. **Responsividade**: removido o último resíduo de grid Bootstrap antigo
   (`row`/`col-*`) que sobrava no `dashboard.html`, substituído por
   `.grid-memora` + nova classe `.dashboard-grid` (1 coluna mobile, 1/3+2/3
   desktop). Confirmado: nenhuma largura fixa >400px em nenhum template,
   nenhuma tag desbalanceada.
8. **3 novos jobs `@Scheduled`** adicionados aos 3 que já existiam
   (PetDecay, Streak, CalendarAlert): `DailyMissionSchedulerJob` (gera
   missões proativamente à 00:01) e `GardenSchedulerJob` (recalcula
   crescimento de plantas a cada 3h, via novo método público
   `GardenService.recalcularTodosOsJardins()` — adicionado sem mudar
   nenhuma assinatura pública existente). Total: 5 jobs.
9. **7 classes de teste JUnit 5 + Mockito** cobrindo exatamente os 6
   Services pedidos pelo usuário (Auth, Gamification, Pet, Shop, Garden,
   StudyPlan) + CalculadoraNivel. Usam AssertJ (`assertThat`) e Mockito
   (`@Mock`/`@InjectMocks`), ambos já vêm via `spring-boot-starter-test`.
10. **Docker**: `Dockerfile` multi-stage (build Maven + runtime JRE Alpine
    não-root + healthcheck), `docker-compose.yml` (mysql + app, variáveis
    com defaults funcionais, rede dedicada), `.env.example`,
    `.dockerignore`. Perfil novo `application-prod.yml` criado para uso
    no compose.
11. **Pequena otimização de código real** (permitida pela política de
    "backend congelado", já que não muda contrato): `ShopService.
    listarCatalogo` buscava o inventário do usuário 2x via repository;
    unificado numa única chamada.
12. **Documentação completa**: `PROJECT_STATUS.md` (percentual de
    conclusão ~90%, o que foi feito, pendências reais), `ARCHITECTURE.md`
    (fluxos, decisões técnicas, por que cada escolha foi feita),
    `DATABASE.md` (schema completo das 22 tabelas, diagrama ER
    simplificado), `README.md` (como rodar via XAMPP/Docker, IA, PWA).

## Pendências reais conhecidas (não bloqueantes, ver PROJECT_STATUS.md §4)

- SMTP de recuperação de senha precisa ser configurado em produção real
  (hoje cai em log se não configurado — comportamento intencional).
- Série de XP semanal/mensal nas Estatísticas é uma aproximação (10XP
  acerto / 2XP erro de quiz), não soma XP de notas/planos/foco
  especificamente nessa série (mas soma no total acumulado geral).
- Sem testes de integração `@SpringBootTest` ainda (só unitários).
- Compilação Maven nunca foi executada neste sandbox (sem `mvn` instalado,
  sem acesso a repositórios Maven Central na allowlist de rede) — toda
  verificação foi revisão manual sistemática (chaves/parênteses/divs
  balanceados, imports cruzados, assinaturas conferidas a mão).

## Se for pedido para continuar further

- Não recriar nada que já existe — sempre `find`/`grep` primeiro para
  confirmar o estado real antes de assumir que algo falta.
- Qualquer nova entidade/módulo/API exige confirmação explícita do
  usuário antes de implementar (regra de "backend congelado" em vigor).
- Manter os 3 fragments de navegação (`sidebar`/`drawer`/`bottom-nav`)
  sincronizados manualmente se algum item de menu for adicionado/removido
  — não há fonte única de verdade para isso hoje (oportunidade de
  refatoração futura, mencionada em ARCHITECTURE.md §11).
