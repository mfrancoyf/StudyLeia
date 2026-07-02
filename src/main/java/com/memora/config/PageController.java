package com.memora.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller MVC simples que apenas resolve qual template Thymeleaf
 * servir para cada rota de página. Não contém regra de negócio — os
 * dados de cada página são buscados via JS/HTMX chamando os
 * endpoints REST (/api/**) depois que a página carrega, com exceção
 * do dashboard, que poderia futuramente ser enriquecido com Model
 * para renderização inicial mais rápida (server-side).
 *
 * Rotas públicas (login, registro, recuperação de senha) estão
 * liberadas no SecurityConfig; todas as demais exigem autenticação.
 */
@Controller
public class PageController {

    @GetMapping("/")
    public String raiz() {
        return "redirect:/dashboard";
    }

    @GetMapping("/login")
    public String login() {
        return "auth/login";
    }

    @GetMapping("/registro")
    public String registro() {
        return "auth/registro";
    }

    @GetMapping("/esqueci-senha")
    public String esqueciSenha() {
        return "auth/esqueci-senha";
    }

    @GetMapping("/redefinir-senha")
    public String redefinirSenha() {
        return "auth/redefinir-senha";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/leia")
    public String telaLeia() {
        return "pet/principal";
    }

    @GetMapping("/shop")
    public String shop() {
        return "shop/loja";
    }

    @GetMapping("/garden")
    public String garden() {
        return "garden/jardim";
    }

    @GetMapping("/statistics")
    public String statistics() {
        return "statistics/painel";
    }

    @GetMapping("/quizzes")
    public String quizzes() {
        return "quiz/lista";
    }

    @GetMapping("/quizzes/criar")
    public String criarQuiz() {
        return "quiz/criar";
    }

    @GetMapping("/quizzes/gerar-com-ia")
    public String gerarQuizComIA() {
        return "quiz/gerar-ia";
    }

    @GetMapping("/quizzes/{id}/jogar")
    public String jogarQuiz() {
        return "quiz/jogar";
    }

    @GetMapping("/notes")
    public String notes() {
        return "notes/lista";
    }

    @GetMapping("/study-plans")
    public String studyPlans() {
        return "studyplan/lista";
    }

    @GetMapping("/study-plans/gerar")
    public String gerarStudyPlan() {
        return "studyplan/gerar";
    }

    @GetMapping("/study-plans/{id}")
    public String detalheStudyPlan() {
        return "studyplan/detalhe";
    }

    @GetMapping("/calendar")
    public String calendar() {
        return "calendar/lista";
    }

    @GetMapping("/focus")
    public String focus() {
        return "focus/modo-foco";
    }

    @GetMapping("/achievements")
    public String achievements() {
        return "gamification/achievements";
    }

    @GetMapping("/perfil")
    public String perfil() {
        return "auth/perfil";
    }
}
