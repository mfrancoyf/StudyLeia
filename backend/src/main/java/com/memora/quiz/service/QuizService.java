package com.memora.quiz.service;

import com.memora.auth.entity.Usuario;
import com.memora.dailymission.entity.TipoMissaoDiaria;
import com.memora.dailymission.service.DailyMissionService;
import com.memora.exception.AcessoNegadoException;
import com.memora.exception.RecursoNaoEncontradoException;
import com.memora.gamification.entity.TipoAtividade;
import com.memora.gamification.service.GamificationService;
import com.memora.integration.ai.dto.QuestaoGerada;
import com.memora.integration.ai.service.AIQuizGeneratorService;
import com.memora.quiz.dto.*;
import com.memora.quiz.entity.*;
import com.memora.quiz.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final GamificationService gamificationService;
    private final AIQuizGeneratorService aiQuizGeneratorService;
    private final DailyMissionService dailyMissionService;

    @Transactional(readOnly = true)
    public List<QuizResumoResponse> listarPorUsuario(UUID usuarioId) {
        return quizRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId)
                .stream().map(this::toResumoResponse).toList();
    }

    @Transactional(readOnly = true)
    public QuizResponse buscarPorId(UUID id, UUID usuarioId) {
        Quiz quiz = buscarComQuestoesEValidarPropriedade(id, usuarioId);
        return toResponse(quiz);
    }

    @Transactional
    public QuizResponse criarManual(Usuario usuario, QuizCriarRequest request) {
        Quiz quiz = Quiz.builder()
                .usuario(usuario)
                .titulo(request.titulo())
                .tema(request.tema())
                .dificuldade(request.dificuldade())
                .origem(OrigemQuiz.MANUAL)
                .build();

        int ordem = 0;
        for (var questaoRequest : request.questoes()) {
            QuizQuestion questao = QuizQuestion.builder()
                    .pergunta(questaoRequest.pergunta())
                    .ordem(ordem++)
                    .build();

            validarExatamenteUmaCorreta(questaoRequest.alternativas());

            for (var altRequest : questaoRequest.alternativas()) {
                questao.adicionarAlternativa(QuizAnswer.builder()
                        .texto(altRequest.texto())
                        .letra(altRequest.letra().toUpperCase())
                        .correta(altRequest.correta())
                        .build());
            }
            quiz.adicionarQuestao(questao);
        }

        quiz = quizRepository.save(quiz);
        log.info("Quiz manual '{}' criado pelo usuário {}", quiz.getTitulo(), usuario.getId());

        return toResponse(quiz);
    }

    /**
     * Gera um quiz completo via IA: delega a geração textual das
     * questões ao AIQuizGeneratorService (que por sua vez usa o
     * AIProvider ativo) e persiste o resultado como um Quiz normal,
     * com origem=IA — a partir daqui ele se comporta exatamente como
     * um quiz manual (mesma tela de resposta, mesma gamificação).
     */
    @Transactional
    public QuizResponse gerarComIA(Usuario usuario, GerarQuizIARequest request) {
        List<QuestaoGerada> questoesGeradas = aiQuizGeneratorService.gerarQuestoes(
                request.tema(), request.quantidade(), request.dificuldade().name());

        Quiz quiz = Quiz.builder()
                .usuario(usuario)
                .titulo("Quiz de " + request.tema())
                .tema(request.tema())
                .dificuldade(request.dificuldade())
                .origem(OrigemQuiz.IA)
                .build();

        int ordem = 0;
        for (QuestaoGerada questaoGerada : questoesGeradas) {
            QuizQuestion questao = QuizQuestion.builder()
                    .pergunta(questaoGerada.pergunta())
                    .ordem(ordem++)
                    .build();

            for (var alt : questaoGerada.alternativas()) {
                questao.adicionarAlternativa(QuizAnswer.builder()
                        .texto(alt.texto())
                        .letra(alt.letra().toUpperCase())
                        .correta(alt.correta())
                        .build());
            }
            quiz.adicionarQuestao(questao);
        }

        quiz = quizRepository.save(quiz);
        log.info("Quiz '{}' gerado via IA para o usuário {} ({} questões)", quiz.getTitulo(), usuario.getId(), questoesGeradas.size());

        return toResponse(quiz);
    }

    /**
     * Processa a resposta da usuária a uma questão específica.
     * Concede XP/moedas via GamificationService e devolve qual era a
     * alternativa correta (para o frontend revelar e animar a Leia).
     */
    @Transactional
    public RespostaQuestaoResultado responderQuestao(Usuario usuario, UUID quizId, UUID questaoId, ResponderQuestaoRequest request) {
        Quiz quiz = buscarComQuestoesEValidarPropriedade(quizId, usuario.getId());

        QuizQuestion questao = quiz.getQuestoes().stream()
                .filter(q -> q.getId().equals(questaoId))
                .findFirst()
                .orElseThrow(() -> new RecursoNaoEncontradoException("Questão não encontrada neste quiz."));

        QuizAnswer alternativaEscolhida = questao.getAlternativas().stream()
                .filter(a -> a.getId().equals(request.alternativaId()))
                .findFirst()
                .orElseThrow(() -> new RecursoNaoEncontradoException("Alternativa não encontrada nesta questão."));

        QuizAnswer alternativaCorreta = questao.getAlternativas().stream()
                .filter(QuizAnswer::isCorreta)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Questão sem alternativa correta cadastrada."));

        boolean acertou = alternativaEscolhida.isCorreta();

        registrarTentativa(usuario, questao, alternativaEscolhida, acertou);

        dailyMissionService.incrementarProgresso(usuario, TipoMissaoDiaria.RESPONDER_10_QUESTOES, 1);

        var recompensa = acertou
                ? gamificationService.concederRecompensa(usuario, TipoAtividade.QUIZ_RESPOSTA_CORRETA)
                : registrarErroEDevolverRecompensaMinima(usuario);

        String mensagem = acertou
                ? escolherMensagemAcerto()
                : escolherMensagemIncentivo();

        return new RespostaQuestaoResultado(acertou, alternativaCorreta.getId(), mensagem, recompensa);
    }

    /**
     * Chamado quando a usuária termina de responder todas as
     * questões de um quiz — concede o bônus de "quiz completo" além
     * do XP individual já ganho por cada resposta correta.
     */
    @Transactional
    public com.memora.gamification.dto.RecompensaResponse concluirQuiz(Usuario usuario, UUID quizId) {
        buscarComQuestoesEValidarPropriedade(quizId, usuario.getId()); // valida propriedade
        return gamificationService.concederRecompensa(usuario, TipoAtividade.QUIZ_COMPLETO);
    }

    @Transactional
    public void excluir(UUID id, UUID usuarioId) {
        Quiz quiz = buscarEValidarPropriedade(id, usuarioId);
        quizRepository.delete(quiz);
    }

    private com.memora.gamification.dto.RecompensaResponse registrarErroEDevolverRecompensaMinima(Usuario usuario) {
        gamificationService.registrarErroQuiz(usuario);
        // registrarErroQuiz já cuida do XP de consolo; aqui devolvemos
        // um RecompensaResponse "neutro" coerente para o frontend.
        return new com.memora.gamification.dto.RecompensaResponse(
                TipoAtividade.QUIZ_RESPOSTA_ERRADA.getXp(), 0, 0, 0, 0, false, false, null
        );
    }

    private void registrarTentativa(Usuario usuario, QuizQuestion questao, QuizAnswer escolhida, boolean correta) {
        QuizAttempt tentativa = QuizAttempt.builder()
                .usuario(usuario)
                .quizQuestion(questao)
                .respostaEscolhida(escolhida)
                .correta(correta)
                .build();
        quizAttemptRepository.save(tentativa);
    }

    private void validarExatamenteUmaCorreta(List<QuizCriarRequest.AlternativaRequest> alternativas) {
        long totalCorretas = alternativas.stream().filter(QuizCriarRequest.AlternativaRequest::correta).count();
        if (totalCorretas != 1) {
            throw new IllegalArgumentException("Cada questão deve ter exatamente uma alternativa correta.");
        }
    }

    private Quiz buscarComQuestoesEValidarPropriedade(UUID id, UUID usuarioId) {
        Quiz quiz = quizRepository.buscarComQuestoesEAlternativas(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Quiz não encontrado."));
        if (!quiz.getUsuario().getId().equals(usuarioId)) {
            throw new AcessoNegadoException("Este quiz não pertence ao usuário autenticado.");
        }
        return quiz;
    }

    private Quiz buscarEValidarPropriedade(UUID id, UUID usuarioId) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Quiz não encontrado."));
        if (!quiz.getUsuario().getId().equals(usuarioId)) {
            throw new AcessoNegadoException("Este quiz não pertence ao usuário autenticado.");
        }
        return quiz;
    }

    private String escolherMensagemAcerto() {
        String[] mensagens = {
                "Isso! A Leia tá pulando de alegria! 🐾",
                "Acertou! Você é demais!",
                "Perfeito! Continue assim!",
                "Mandou bem! A Leia ronronou de orgulho."
        };
        return mensagens[(int) (Math.random() * mensagens.length)];
    }

    private String escolherMensagemIncentivo() {
        String[] mensagens = {
                "Quase! A Leia acredita em você, tenta a próxima!",
                "Não foi essa, mas você consegue! Vamos continuar.",
                "Sem problema, errar faz parte de aprender. Bora pra próxima!",
                "A Leia te dá um cafuné e diz: vamos de novo!"
        };
        return mensagens[(int) (Math.random() * mensagens.length)];
    }

    // ===================== Mapeamento entidade → DTO =====================
    // Feito manualmente (sem MapStruct) porque o alvo é um record com
    // records aninhados (QuestaoResponse/AlternativaResponse) — esse
    // combinado é historicamente frágil na geração de código do
    // MapStruct. Mapear na mão aqui é mais simples e elimina esse risco
    // por completo, sem mudar nenhum contrato de API.

    private QuizResponse toResponse(Quiz quiz) {
        return new QuizResponse(
                quiz.getId(),
                quiz.getTitulo(),
                quiz.getTema(),
                quiz.getDificuldade(),
                quiz.getOrigem(),
                quiz.getQuestoes().size(),
                quiz.getCriadoEm(),
                mapearQuestoesOrdenadas(quiz.getQuestoes())
        );
    }

    private QuizResumoResponse toResumoResponse(Quiz quiz) {
        return new QuizResumoResponse(
                quiz.getId(),
                quiz.getTitulo(),
                quiz.getTema(),
                quiz.getDificuldade(),
                quiz.getOrigem(),
                quiz.getQuestoes().size(),
                quiz.getCriadoEm()
        );
    }

    private List<QuizResponse.QuestaoResponse> mapearQuestoesOrdenadas(List<QuizQuestion> questoes) {
        return questoes.stream()
                .sorted(Comparator.comparingInt(QuizQuestion::getOrdem))
                .map(q -> new QuizResponse.QuestaoResponse(
                        q.getId(),
                        q.getPergunta(),
                        q.getOrdem(),
                        mapearAlternativas(q.getAlternativas())
                ))
                .toList();
    }

    private List<QuizResponse.AlternativaResponse> mapearAlternativas(List<QuizAnswer> alternativas) {
        return alternativas.stream()
                .sorted(Comparator.comparing(QuizAnswer::getLetra))
                .map(a -> new QuizResponse.AlternativaResponse(a.getId(), a.getTexto(), a.getLetra()))
                .toList();
    }
}
